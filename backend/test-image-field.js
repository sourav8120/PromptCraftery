const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();

const Prompt = require('./models/Prompt');

async function testImageUpload() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get first prompt
    const prompt = await Prompt.findOne();
    if (!prompt) {
      console.error('No prompts found');
      process.exit(1);
    }

    console.log(`Testing with prompt: ${prompt.title}`);
    console.log(`Prompt ID: ${prompt._id}`);
    console.log(`Current resultImage: ${prompt.resultImage || 'null'}\n`);

    // Update with a test image URL
    const testImageUrl = '/uploads/prompts/test-image.jpg';
    
    const updated = await Prompt.findByIdAndUpdate(
      prompt._id,
      { resultImage: testImageUrl },
      { new: true }
    );

    console.log(`✅ Updated resultImage to: ${updated.resultImage}`);
    
    // Verify by fetching
    const fetched = await Prompt.findById(prompt._id);
    console.log(`✅ Verified fetch: ${fetched.resultImage}`);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

testImageUpload();
