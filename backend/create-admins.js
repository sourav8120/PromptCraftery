const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Admin = require('./models/Admin');

const createAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/promptvault');

    console.log('Connected to MongoDB');

    // Create admin accounts
    await Admin.deleteMany({}); // Clear existing

    const admin1 = await Admin.create({
      name: 'PromptVault Admin',
      email: 'admin@promptvault.com',
      password: 'Admin@123456',
      role: 'superadmin',
    });

    const admin2 = await Admin.create({
      name: 'PromptCraftery Admin',
      email: 'admin@promptcraftery.com',
      password: 'Admin@123456',
      role: 'superadmin',
    });

    console.log(`✅ Created admin@promptvault.com`);
    console.log(`✅ Created admin@promptcraftery.com`);

    process.exit(0);
  } catch (error) {
    console.error('Error creating admins:', error);
    process.exit(1);
  }
};

createAdmins();
