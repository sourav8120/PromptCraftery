const mongoose = require('mongoose');
const Category = require('./models/Category');
const Prompt = require('./models/Prompt');
const Admin = require('./models/Admin');

(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/promptvault');
    
    const categoryCount = await Category.countDocuments();
    const promptCount = await Prompt.countDocuments();
    const adminCount = await Admin.countDocuments();
    
    const promptsByCategory = await Prompt.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'cat' } },
      { $project: { category: { $arrayElemAt: ['$cat.name', 0] }, count: 1 } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('📊 Database Statistics:');
    console.log('========================');
    console.log(`Total Categories: ${categoryCount}`);
    console.log(`Total Prompts: ${promptCount.toLocaleString()}`);
    console.log(`Total Admins: ${adminCount}`);
    console.log(`\nPrompts per Category:`);
    promptsByCategory.forEach(c => {
      console.log(`  ${c.category}: ${c.count.toLocaleString()}`);
    });
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
