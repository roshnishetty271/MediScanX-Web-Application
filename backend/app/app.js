// ./app/app.js
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import registerRoutes from './routes/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const initialize = (app) => {
  console.log('Initializing app...')
  // MongoDB URI - use environment variable
  const mongoDBURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/MasterDb';

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // MongoDB connection - remove deprecated options
  mongoose.connect(mongoDBURI)
  .then(() => {
    console.log(`Connected to MongoDB at ${mongoDBURI.replace(/mongodb:\/\/([^:]+):[^@]+@/, 'mongodb://$1:****@')}`);
  })
  .catch((err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  });

  // Event listeners for Mongoose connection
  const db = mongoose.connection;

  // Successfully connected
  db.on('connected', () => {
    console.log(`Connected to MongoDB at ${mongoDBURI.replace(/mongodb:\/\/([^:]+):[^@]+@/, 'mongodb://$1:****@')}`);
  });

  // Connection error
  db.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  });

  // Disconnected
  db.on('disconnected', () => {
    console.log('MongoDB connection disconnected');
  });
  
  // Register routes
  registerRoutes(app);
};

// Export the initialize function
export default initialize;
