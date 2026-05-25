const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Prompt = require('./models/Prompt');

async function checkDescriptions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const promptsWithoutDesc = await Prompt.find({ $or: [{ description: null }, { description: '' }] })
      .select('title description');
    
    console.log(`Found ${promptsWithoutDesc.length} prompts without descriptions:\n`);
    promptsWithoutDesc.forEach(p => {
      console.log(`- ${p.title}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkDescriptions();
