const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/User'); // Adjust the path as needed
require("dotenv").config()
const JWT_SECRET = process.env.JWT; // Use an environment variable for security

// Signup function
const Signup = async (req, res) => {
    try {
        const { username, password, email, phonenumber, name } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ $or: [{ email }, { username }, { phonenumber }] });
        if (existingUser) {
            return res.status(200).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new UserModel({ username, password: hashedPassword, email, phonenumber, name });
        await newUser.save();

        // Generate token
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '100y' });

        res.status(201).json({ success: true, message: 'Signup successful', token, user: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Signin function
const Signin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const user = await UserModel.findOne({ username }).populate({
            path: 'friends',
            select: '-password'
        });
        if (!user) {
            return res.status(200).json({ success: false, message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(200).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '100y' });

        res.status(200).json({ success: true, message: 'Signin successful', token, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};




module.exports = { Signup, Signin };