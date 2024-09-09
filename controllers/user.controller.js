import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';
import dotenv from 'dotenv';

dotenv.config();

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15d' }); 
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' }); 
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password });
    res.status(201).json({
      message: 'User Register successfully',
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict', 
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
      });


      res.cookie('accessToken', accessToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict', 
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
      });

      res.json({
        message: 'User logged in successfully',
        user,
        accessToken, 
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const FindById = async (req, res) => {
  const { userId } = req.params; 

  try {
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      
      res.status(200).json({message : "user fetch successfully", user });
  } catch (error) {
      res.status(500).json({ message: 'Error during findById', error });
  }
};

export const logout = async (req, res) => {
  const { refreshToken } = req.cookies;  




  if (!refreshToken) {
    return res.status(400).json({ message: 'No refresh token found' });
  }

  try {
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null; 
      await user.save();
    }

    res.cookie('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      expires: new Date(0),
    });

    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      expires: new Date(0),
    });

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error during logout' });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({message : "All users fetch succesfully", users});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
