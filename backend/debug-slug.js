const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Category = require('./models/Category');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const instagramCat = await Category.findOne({ name: 'Instagram Trending' });
    console.log('Instagram Trending Category:');
    console.log(`Name: ${instagramCat.name}`);
    console.log(`Slug: ${instagramCat.slug}`);
    console.log(`IsActive: ${instagramCat.isActive}`);
    console.log(`Order: ${instagramCat.order}`);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

debug();
