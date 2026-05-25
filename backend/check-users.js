const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/promptcraftery');
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find().select('email subscription promptsUsed copiedPrompts');
    
    console.log('📋 All Users Status:');
    console.log('═'.repeat(90));
    
    users.forEach(user => {
      console.log(`\n👤 ${user.email}`);
      console.log(`   Plan: ${user.subscription?.plan || 'none'}`);
      console.log(`   Status: ${user.subscription?.status || 'n/a'}`);
      console.log(`   Limit: ${user.subscription?.promptsLimit || 0} prompts`);
      console.log(`   Used: ${user.promptsUsed || 0} / ${user.subscription?.promptsLimit || 0}`);
      console.log(`   Remaining: ${(user.subscription?.promptsLimit || 0) - (user.promptsUsed || 0)}`);
      console.log(`   Unique Copies: ${user.copiedPrompts?.length || 0}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkUsers();
