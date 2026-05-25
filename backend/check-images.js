const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Prompt = require('./models/Prompt');

async function checkImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get first 5 prompts
    const prompts = await Prompt.find().select('title resultImage').limit(5);
    
    console.log('Sample prompts:');
    prompts.forEach(p => {
      console.log(`- ${p.title}`);
      console.log(`  resultImage: ${p.resultImage || 'null/undefined'}`);
      console.log('');
    });

    // Count prompts with images
    const withImages = await Prompt.countDocuments({ resultImage: { $exists: true, $ne: null } });
    console.log(`\nTotal prompts with images: ${withImages}`);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkImages();
