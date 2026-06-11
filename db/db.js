import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MONGODB_URI } from '../config/dbCredentials.js';

dotenv.config();

mongoose.set('bufferCommands', false);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected.');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB runtime error:', error.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected.');
});

export const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Atlas connection established.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};