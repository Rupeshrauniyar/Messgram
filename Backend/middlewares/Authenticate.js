const jwt = require('jsonwebtoken');
const UserModel = require('../models/User'); // Adjust the path as needed
require("dotenv").config()
const JWT_SECRET = process.env.JWT; // Use an environment variable for security


const Authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(200).json({ success: false, message: 'Access denied, no token provided' });
        }

        // Extract the actual token
        const extractedToken = token.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(extractedToken, JWT_SECRET);
        const user = await UserModel.findById(decoded.userId).select("-password").populate({
            path: 'friends',
            select: '-password'
        });
        if (!user) {
            return res.status(200).json({ success: false, message: 'User not found' });
        }

        req.user = user; // Attach user to request
        next(); // Move to the next middleware or route
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token', error: error.message });
    }
};


module.exports = Authenticate