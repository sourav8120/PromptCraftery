const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
dotenv.config();

const Category = require('./models/Category');

async function fixSlugs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Find all categories with missing slugs
    const categoriesWithoutSlugs = await Category.find({ slug: null });
    console.log(`Found ${categoriesWithoutSlugs.length} categories with missing slugs\n`);

    for (const cat of categoriesWithoutSlugs) {
      const newSlug = slugify(cat.name, { lower: true, strict: true });
      await Category.findByIdAndUpdate(cat._id, { slug: newSlug });
      console.log(`✅ Fixed: ${cat.name} → ${newSlug}`);
    }

    // Also check for undefined slugs (different from null)
    const allCategories = await Category.find({});
    console.log(`\nChecking all ${allCategories.length} categories for undefined slugs...`);
    
    for (const cat of allCategories) {
      if (!cat.slug || cat.slug === 'undefined') {
        const newSlug = slugify(cat.name, { lower: true, strict: true });
        await Category.findByIdAndUpdate(cat._id, { slug: newSlug });
        console.log(`✅ Fixed undefined: ${cat.name} → ${newSlug}`);
      }
    }

    console.log('\n🎉 All category slugs fixed!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixSlugs();
