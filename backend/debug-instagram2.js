const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Prompt = require('./models/Prompt');
const Category = require('./models/Category');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Find all Instagram-related prompts by title
    const prompts = await Prompt.find({ title: { $regex: 'Instagram', $options: 'i' } })
      .select('title category slug');
    
    console.log(`Found ${prompts.length} Instagram prompts:\n`);
    
    for (const p of prompts) {
      const cat = await Category.findById(p.category);
      console.log(`📌 ${p.title}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Category ID: ${p.category}`);
      console.log(`   Category Name: ${cat ? cat.name : '❌ NOT FOUND'}`);
      console.log('');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

debug();
