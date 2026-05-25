const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Prompt = require('./models/Prompt');

// Map of prompt titles to descriptions
const descriptions = {
  'Draft a letter': 'Write a professional letter for various purposes',
  'Write the page': 'Create engaging page content for your website',
  'Describe a city': 'Craft vivid descriptions of cities and locations',
  'Explain the bug': 'Break down technical bugs in simple terms',
  'Refractor the function': 'Optimize and improve code functions',
  'Write a Read me File': 'Create comprehensive README documentation',
  'Design a  database': 'Plan and design database schemas',
  'Turn this Psedocode': 'Convert pseudocode to working code',
  'Build a CLI tools': 'Develop command-line interface tools',
  'Write a code review': 'Provide constructive code review feedback',
  'Debug this Logic': 'Identify and fix logical errors in code',
  'Business': 'General business advice and strategies',
  'Start a business plan': 'Create a comprehensive business plan',
  'Identyfy the Own Risk': 'Identify risks specific to your business',
  'Pitch a business plan': 'Develop a compelling business pitch',
  'Physical Feet': 'Improve physical fitness and foot health',
  'Create a 6 hooks fr': 'Create 6 effective hooks for content',
  'Workout Plan': 'Design personalized workout routines',
  'Explain the Science': 'Break down complex scientific concepts',
  'Write a Meal Plan': 'Create balanced meal plans for nutrition',
  'Create a sleep Optimization': 'Optimize sleep patterns and quality',
  'Mental Health': 'Mental health tips and wellness advice',
  'Create a stress Protocol': 'Develop stress management protocols',
  'Nutrition': 'Nutrition advice and dietary guidelines',
  'Design a recovery': 'Design recovery strategies for wellness',
  'Nutration Level Decoder': 'Decode nutrition information and labels',
  'Write a Headline': 'Craft compelling headlines and titles',
  'Write the business section': 'Write business sections for documents',
  'Create a Welcome Email': 'Design welcome emails for customers',
  'Draft a Cold Email': 'Write engaging cold outreach emails',
  'Rename This Objection': 'Handle and reframe objections effectively',
  'Nice to be work here': 'Create welcoming workplace content',
  'Why this things welcome': 'Explain the value proposition clearly'
};

async function addDescriptions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    let updated = 0;
    for (const [title, description] of Object.entries(descriptions)) {
      const result = await Prompt.findOneAndUpdate(
        { title: title },
        { description: description },
        { new: true }
      );
      
      if (result) {
        console.log(`✅ Updated: ${title}`);
        updated++;
      } else {
        console.log(`⏭️  Not found: ${title}`);
      }
    }

    console.log(`\n🎉 Updated ${updated} prompts with descriptions!`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

addDescriptions();
