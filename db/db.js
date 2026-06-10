import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MONGODB_URI } from '../config/dbCredentials.js';

dotenv.config();


export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Atlas connection established.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};