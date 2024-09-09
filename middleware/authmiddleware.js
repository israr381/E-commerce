import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';
import dotenv from 'dotenv';

dotenv.config();

export const protect = async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');

        next(); 
    } catch (error) {
        console.error('Token verification error:', error.message);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
