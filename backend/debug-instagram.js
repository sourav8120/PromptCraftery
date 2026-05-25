const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Prompt = require('./models/Prompt');
const Category = require('./models/Category');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Check Instagram category
    const instagramCat = await Category.findOne({ name: 'Instagram Trending' });
    console.log('Instagram Trending Category:', instagramCat);
    console.log('---\n');

    // Check all Instagram prompts
    const prompts = await Prompt.find({ tags: 'instagram' }).select('title category');
    console.log('Instagram Prompts:');
    prompts.forEach(p => {
      console.log(`- ${p.title}`);
      console.log(`  Category ID: ${p.category}`);
    });
    console.log('---\n');

    // Check Instagram prompts with populated category
    const promptsPopulated = await Prompt.find({ tags: 'instagram' }).populate('category');
    console.log('Instagram Prompts (Populated):');
    promptsPopulated.forEach(p => {
      console.log(`- ${p.title}`);
      console.log(`  Category: ${p.category ? p.category.name : 'NOT FOUND'}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

debug();
