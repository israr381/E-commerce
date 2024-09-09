import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { DB_NAME } from '../contant.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME.trim()}`, {
      connectTimeoutMS: 10000, 
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

export default connectDB;
