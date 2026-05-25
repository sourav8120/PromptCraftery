const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Prompt = require('./models/Prompt');
const Category = require('./models/Category');

const instagramTrendingPrompts = [
  {
    title: 'Viral Instagram Caption Generator',
    content: 'Create a viral-worthy Instagram caption for my post about [TOPIC/PRODUCT]. The caption should:\n1. **Hook**: Start with an attention-grabbing hook or question\n2. **Story**: Tell a brief relatable story (2-3 sentences)\n3. **Value**: Provide a clear benefit or insight\n4. **CTA**: Include a clear call-to-action\n5. **Emojis**: Use 3-5 relevant emojis strategically\n6. **Hashtags**: Suggest 10-15 high-volume hashtags\n\nTarget Audience: [DESCRIBE YOUR AUDIENCE]\nTone: [PROFESSIONAL/CASUAL/INSPIRATIONAL/FUNNY]',
    description: 'Generate engaging captions that drive Instagram engagement',
    tags: ['instagram', 'captions', 'social media', 'engagement'],
    difficulty: 'beginner',
    aiModel: 'Any',
    isFeatured: true
  },
  {
    title: 'Instagram Reel Concept Generator',
    content: 'Generate 5 trending Instagram Reel ideas for [YOUR NICHE]. For each idea, provide:\n1. **Hook**: First 2 seconds (what makes people stop scrolling)\n2. **Main Action**: The core content/transformation\n3. **Trending Music/Audio**: Song/audio suggestion from Instagram\n4. **Text Overlay**: Key on-screen text\n5. **Call-to-Action**: What viewers should do\n6. **Best Time to Post**: When your audience is most active\n\nYour Niche: [DESCRIBE YOUR CONTENT NICHE]\nCurrent Follower Count: [NUMBER]\nTarget Result: [AWARENESS/LEAD GENERATION/SALES]',
    description: 'Create trending Instagram Reel concepts that drive views',
    tags: ['instagram reels', 'video content', 'trending', 'viral'],
    difficulty: 'beginner',
    aiModel: 'Any',
    isFeatured: true
  },
  {
    title: 'Instagram Hashtag Strategy Optimizer',
    content: 'Create a hashtag strategy for my Instagram account targeting [NICHE].\n\nProvide:\n1. **Tier 1 (Mega Tags)**: 1M+ posts - high competition\n2. **Tier 2 (Large Tags)**: 500K-1M posts - medium competition\n3. **Tier 3 (Medium Tags)**: 100K-500K posts - good reach\n4. **Tier 4 (Micro Tags)**: 10K-100K posts - niche specific\n5. **Tier 5 (Nano Tags)**: <10K posts - highly specific\n\nFor each tier, provide 5 relevant hashtags that match my content type.\n\nMy Content Type: [PHOTOGRAPHY/LIFESTYLE/EDUCATION/FASHION/BUSINESS/OTHER]\nTarget Audience Demographics: [AGE/INTERESTS/LOCATION]',
    description: 'Optimize your hashtag strategy for maximum Instagram reach',
    tags: ['hashtags', 'instagram strategy', 'reach', 'growth'],
    difficulty: 'beginner',
    aiModel: 'Any'
  }
];

async function addPrompts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the Instagram Trending category
    const instagramCategory = await Category.findOne({ name: 'Instagram Trending' });
    if (!instagramCategory) {
      console.error('❌ Instagram Trending category not found!');
      process.exit(1);
    }

    console.log(`Found category: ${instagramCategory.name} (ID: ${instagramCategory._id})`);

    // Add category ID to prompts
    const promptsToAdd = instagramTrendingPrompts.map(p => ({
      ...p,
      category: instagramCategory._id
    }));

    // Check if prompts already exist
    const createdPrompts = [];
    for (const prompt of promptsToAdd) {
      const existing = await Prompt.findOne({ title: prompt.title });
      if (!existing) {
        const created = await Prompt.create(prompt);
        createdPrompts.push(created);
        console.log(`✅ Created prompt: ${prompt.title}`);
        // Update category promptCount
        await Category.updateOne({ _id: instagramCategory._id }, { $inc: { promptCount: 1 } });
      } else {
        console.log(`⏭️  Skipped (already exists): ${prompt.title}`);
      }
    }

    console.log(`\n🎉 Added ${createdPrompts.length} Instagram Trending prompts!`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

addPrompts();
