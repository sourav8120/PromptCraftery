const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Prompt = require('./models/Prompt');

async function fixImageUrls() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Update all prompts with relative image URLs to absolute backend URLs
    const result = await Prompt.updateMany(
      { resultImage: { $regex: '^/uploads' } },
      [{ $set: { resultImage: { $concat: ['http://localhost:5000', '$resultImage'] } } }]
    );

    console.log(`✅ Updated ${result.modifiedCount} prompts with correct image URLs`);

    // Verify
    const updated = await Prompt.findOne({ resultImage: { $exists: true, $ne: null } });
    if (updated) {
      console.log(`\nSample updated URL:`);
      console.log(`  ${updated.resultImage}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixImageUrls();
