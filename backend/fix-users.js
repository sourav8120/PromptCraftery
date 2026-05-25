const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function fixUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/promptcraftery');
    console.log('✅ Connected to MongoDB');

    // Find all users that don't have copiedPrompts array
    const result = await User.updateMany(
      { copiedPrompts: { $exists: false } },
      { $set: { copiedPrompts: [] } }
    );

    console.log(`✅ Fixed ${result.modifiedCount} users - initialized copiedPrompts array`);

    // Also ensure all users have promptsUsed field
    const result2 = await User.updateMany(
      { promptsUsed: { $exists: false } },
      { $set: { promptsUsed: 0 } }
    );

    console.log(`✅ Fixed ${result2.modifiedCount} users - initialized promptsUsed`);

    // Check a sample user
    const sampleUser = await User.findOne();
    if (sampleUser) {
      console.log(`\n📊 Sample user data:`);
      console.log(`   Email: ${sampleUser.email}`);
      console.log(`   Plan: ${sampleUser.subscription?.plan}`);
      console.log(`   Limit: ${sampleUser.subscription?.promptsLimit}`);
      console.log(`   Used: ${sampleUser.promptsUsed}`);
      console.log(`   Copied Prompts: ${sampleUser.copiedPrompts?.length || 0}`);
    }

    await mongoose.connection.close();
    console.log('\n✅ Migration complete');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixUsers();
