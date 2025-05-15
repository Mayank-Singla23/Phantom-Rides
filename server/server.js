import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';
import User from './schemas/user.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ['http://localhost:5173', 'https://phantom-rides.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'userid'] // Add 'userid' to allowed headers
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Function to ensure admin user exists
async function ensureAdminExists() {
  try {
    const adminEmail = 'admin@phantomrides.com';
    const adminPassword = 'admin123';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const adminUser = new User({
        name: 'Admin User',
        email: adminEmail,
        password: adminPassword,
        isAdmin: true
      });
      await adminUser.save();
      console.log('Default admin user created:');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
    } else if (!existingAdmin.isAdmin) {
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
      console.log('Updated user to admin status');
    }
  } catch (error) {
    console.error('Error ensuring admin exists:', error);
  }
}

// Create default admin on server start
ensureAdminExists();

import userRoutes from './routes/users.js';
import carRoutes from './routes/cars.js';
import testRideRoutes from './routes/testRides.js';

app.use('/api/user', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/test-rides', testRideRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})