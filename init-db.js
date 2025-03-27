// init-db.js
// A helper script to initialize the database

import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import { seedDatabase } from './backend/app/seeder.js';

// Load environment variables
dotenv.config();

console.log('Starting database initialization...');

// Call the seedDatabase function
seedDatabase()
  .then(() => {
    console.log('Database initialized successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error initializing database:', error);
    process.exit(1);
  }); 