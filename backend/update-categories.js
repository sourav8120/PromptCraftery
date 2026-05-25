const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Category = require('./models/Category');

const categoriesToUpdate = [
  { name: 'Instagram Trending', icon: '📸', color: '#e1306c', description: 'Trending prompts and ideas for Instagram content creation', order: 1 },
  { name: 'Study & Learning', icon: '📚', color: '#3b82f6', description: 'Prompts for students, research, and academic learning', order: 2 },
  { name: 'Software Development', icon: '💻', color: '#8b5cf6', description: 'Code generation, debugging, architecture, and tech prompts', order: 3 },
  { name: 'Physical Fitness', icon: '💪', color: '#f59e0b', description: 'Workout plans, exercise routines, and fitness guidance', order: 4 },
  { name: 'Health & Wellness', icon: '🏥', color: '#10b981', description: 'Health advice, nutrition, mental wellness prompts', order: 5 },
  { name: 'Business & Marketing', icon: '📈', color: '#ef4444', description: 'Marketing copy, business strategy, and entrepreneurship', order: 6 },
  { name: 'Creative Writing', icon: '✍️', color: '#ec4899', description: 'Stories, poetry, scripts, and creative content', order: 7 },
  { name: 'Productivity', icon: '⚡', color: '#06b6d4', description: 'Task management, time optimization, goal setting', order: 8 },
  { name: 'Language Learning', icon: '🌍', color: '#f97316', description: 'Language practice, translation, grammar prompts', order: 9 },
  { name: 'Art & Design', icon: '🎨', color: '#a855f7', description: 'Image generation, design feedback, creative direction', order: 10 },
  { name: 'Finance & Investing', icon: '💰', color: '#84cc16', description: 'Financial planning, investment analysis, budgeting', order: 11 },
  { name: 'Cooking & Recipes', icon: '🍳', color: '#fb923c', description: 'Recipe creation, meal planning, cooking guidance', order: 12 },
  { name: 'Career & Resume', icon: '🎯', color: '#64748b', description: 'Resume writing, interview prep, career guidance', order: 13 }
];

async function updateCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update or create each category
    for (const cat of categoriesToUpdate) {
      await Category.findOneAndUpdate(
        { name: cat.name },
        { ...cat, isActive: true },
        { upsert: true, new: true, runValidators: true }
      );
      console.log(`✅ Updated/Created: ${cat.name}`);
    }

    console.log('\n🎉 Categories updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Update error:', err);
    process.exit(1);
  }
}

updateCategories();
