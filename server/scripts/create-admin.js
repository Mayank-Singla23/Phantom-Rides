import mongoose from 'mongoose';
import User from '../schemas/user.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.DB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Admin user details
const adminUser = {
  name: 'Admin User',
  email: 'admin@phantomrides.com',
  password: 'admin123',
  isAdmin: true
};

// Create admin user
async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Create new admin user
    const newAdmin = new User(adminUser);
    await newAdmin.save();
    
    console.log('Admin user created successfully');
    console.log('Email:', adminUser.email);
    console.log('Password:', adminUser.password);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
