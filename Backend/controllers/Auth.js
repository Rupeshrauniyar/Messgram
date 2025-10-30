const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/User"); // Adjust the path as needed
require("dotenv").config();
const JWT_SECRET = process.env.JWT; // Use an environment variable for security
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Signup function
const Signup = async (req, res) => {
  try {
    const { username, password, email, phonenumber, name } = req.body;

    // Check if user already exists
    const user = await UserModel.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${username}$`, "i") } },
        { email: { $regex: new RegExp(`^${email}$`, "i") } },
      ],
    }).populate({
      path: "friends",
      select: "-password",
    });
    if (user && user?.googleUser) {
      return res.status(200).json({
        success: false,
        message: "Your account is linked with Google",
      });
    } else if (user) {
      return res.status(200).json({
        success: false,
        message: `Your account already exists with ${username}`,
      });
    }
   

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      username,
      password: hashedPassword,
      email,
      phonenumber,
      name,
      googleUser: false,
    });
    await newUser.save();

    // Generate token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "100y",
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Signin function
const Signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(200).json({
        success: false,
        message: "Username and Password are required",
      });
    }
    // Check if user exists
    const user = await UserModel.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${username}$`, "i") } },
        { email: { $regex: new RegExp(`^${username}$`, "i") } },
      ],
    }).populate({
      path: "friends",
      select: "-password",
    });
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }
    if (user.googleUser) {
      return res.status(200).json({
        success: false,
        message: "Your account is linked with Google",
      });
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "100y",
    });

    res
      .status(200)
      .json({ success: true, message: "Signin successful", token, user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const Google = async (req, res) => {
  try {
    const { name, username, uid, email, pp } = req.body;

    // Check if user exists
    const user = await UserModel.findOne({
      $or: [{ email }, { username }],
    }).populate({
      path: "friends",
      select: "-password",
    });
    if (!user) {
      const newUser = await UserModel.create({
        name,
        username,
        uid,
        email,
        pp,
        googleUser: true,
      });
      // Compare password

      // Generate token
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
        expiresIn: "100y",
      });

      res.status(200).json({
        success: true,
        message: "Signin successful",
        token,
        user: newUser,
      });
    } else {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "100y",
      });

      res.status(200).json({
        success: true,
        message: "Signin successful",
        token,
        user,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const ForgotPassword = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username)
      return res.status(403).json({ message: "Username is required" });

    const User = await UserModel.findOne({ username });
    if (!User) return res.status(403).json({ message: "User not found" });
    const token = jwt.sign(User._id, JWT_SECRET);
    const resetURL = `${process.env.FRONTEND}/forgot-password/${token}`;

    const mail = {
      from: "PMS <propertymanagementsystem.pms@gmail.com>",
      to: Data.email,
      subject: "Password Reset Request",
      html: `
               <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
      <div>
        <h2 style="color: #333; font-size: 28px; font-weight: bold;">Reset Your Password</h2>
      </div>
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the button below to proceed:</p>
      <div style="margin: 30px 0;">
        <a
          
        style = "background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-size: 16px; font-weight: bold;"
        href=${resetURL}
            >
            Reset Password
        </a >
      </div >
      <p>If you didn't request this, you can safely ignore this email.
      </p>
      <p>This link will expire in 15 minutes.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #666; font-size: 12px;">
        This is an automated message. Please do not reply.
      </p>
    </div >
    `,
    };
    await sgMail.send(mail).then(() => {
      console.log("Email sent");
      return res
        .status(200)
        .json({ message: "Email sent. Token Expiration Time: 15 mins" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { Signup, Signin, ForgotPassword, Google };
