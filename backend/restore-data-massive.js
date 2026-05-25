const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
dotenv.config();

const Category = require('./models/Category');
const Prompt = require('./models/Prompt');
const Admin = require('./models/Admin');

// Generate 1000+ prompts per category
const generateMassivePrompts = (categoryMap) => {
  const prompts = [];
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const aiModels = ['ChatGPT', 'Claude', 'Gemini', 'GPT-4', 'Any'];

  // Template variations for Study & Learning
  const studyTemplates = [
    { title: 'Feynman Technique: [TOPIC]', desc: 'Explain any topic using simple language', base: 'Explain [TOPIC] as if I\'m a complete beginner. Use simple analogies and real-world examples.' },
    { title: '[TOPIC] Study Guide', desc: 'Comprehensive study guide for any subject', base: 'Create a detailed study guide for [TOPIC] covering: key concepts, definitions, examples, and practice problems.' },
    { title: '[TOPIC] Flashcard Set', desc: 'Generate study flashcards', base: 'Create 20 flashcard pairs (Q&A) for [TOPIC] with definitions and examples.' },
    { title: '[TOPIC] Mind Map', desc: 'Visualize concepts', base: 'Create a mind map for [TOPIC] showing relationships between concepts.' },
    { title: '[TOPIC] Practice Quiz', desc: 'Test your knowledge', base: 'Generate 15 multiple-choice questions about [TOPIC] with answer key.' },
    { title: '[TOPIC] Essay Outline', desc: 'Structure your writing', base: 'Create a detailed essay outline for [TOPIC] with thesis and main points.' },
    { title: '[TOPIC] Summary Notes', desc: 'Quick reference material', base: 'Summarize [TOPIC] in 5-7 key points with brief explanations.' },
    { title: '[TOPIC] Comparison Guide', desc: 'Compare and contrast', base: 'Compare and contrast [TOPIC] with [RELATED TOPIC]. Show similarities and differences.' },
    { title: '[TOPIC] History & Context', desc: 'Learn the background', base: 'Explain the history and context of [TOPIC]. When did it start? How did it develop?' },
    { title: '[TOPIC] Real-World Applications', desc: 'See practical uses', base: 'Give 5-7 real-world applications of [TOPIC] with examples.' },
    { title: '[TOPIC] Common Mistakes', desc: 'Avoid learning errors', base: 'List 10 common mistakes people make when learning [TOPIC] and how to avoid them.' },
    { title: '[TOPIC] Advanced Topics', desc: 'Go deeper', base: 'What are the most advanced topics related to [TOPIC]? Explain each briefly.' },
    { title: '[TOPIC] Case Study', desc: 'Learn from examples', base: 'Analyze a case study related to [TOPIC]. Show how concepts apply in practice.' },
    { title: '[TOPIC] Interview Preparation', desc: 'Ace technical interviews', base: 'Prepare for interview questions about [TOPIC]. Provide model answers.' },
    { title: '[TOPIC] Resource Collection', desc: 'Find learning materials', base: 'Recommend 10 best resources (books, courses, videos) for learning [TOPIC].' },
  ];

  // Template variations for Instagram Trending
  const instagramTemplates = [
    { title: '[CONTENT TYPE] Caption Ideas', desc: 'Generate viral captions', base: 'Create 10 different caption variations for [CONTENT TYPE] posts about [TOPIC].' },
    { title: '[NICHE] Content Calendar', desc: 'Plan your content', base: 'Create a weekly content calendar for [NICHE] with 6 post ideas and captions.' },
    { title: '[TREND] Trendjacking Ideas', desc: 'Capitalize on trends', base: 'Generate 5 ways to trendjack [TREND] for [NICHE].' },
    { title: '[GOAL] Growth Strategy', desc: 'Grow your account', base: 'Create a growth strategy for [NICHE] accounts with engagement tactics.' },
    { title: '[TOPIC] Reel Script', desc: 'Create video scripts', base: 'Write a 30-60 second Instagram Reel script about [TOPIC].' },
    { title: '[NICHE] Hashtag Strategy', desc: 'Optimize hashtags', base: 'Create a hashtag strategy for [NICHE] with 30 relevant hashtags.' },
    { title: '[AUDIENCE] Carousel Ideas', desc: 'Design carousels', base: 'Generate 5 carousel post ideas for [AUDIENCE] about [TOPIC].' },
    { title: '[TOPIC] Story Series', desc: 'Plan story sequences', base: 'Plan a 10-story sequence for [TOPIC] with engagement hooks.' },
    { title: '[BRAND] Bio Optimization', desc: 'Perfect your profile', base: 'Create an optimized Instagram bio for [BRAND] with CTA and keywords.' },
    { title: '[CONTENT TYPE] Analytics Review', desc: 'Analyze performance', base: 'How to interpret Instagram analytics for [CONTENT TYPE] performance.' },
    { title: '[NICHE] Influencer Brief', desc: 'Collaborate with influencers', base: 'Create an influencer collaboration brief for [NICHE].' },
    { title: '[GOAL] Engagement Tactics', desc: 'Boost engagement', base: 'Generate 15 proven engagement tactics for [NICHE].' },
    { title: '[TOPIC] DM Automation', desc: 'Automate messages', base: 'Create automated DM sequences for [TOPIC].' },
    { title: '[AUDIENCE] Reels Hooks', desc: 'Grab attention instantly', base: 'Generate 20 attention-grabbing Reel opening hooks for [AUDIENCE].' },
    { title: '[CONTENT TYPE] Editing Tips', desc: 'Polish your content', base: 'Best editing practices for [CONTENT TYPE] on Instagram.' },
  ];

  // Template variations for Software Development
  const devTemplates = [
    { title: '[LANGUAGE] Best Practices', desc: 'Code quality tips', base: '[LANGUAGE] coding best practices and conventions for [PROJECT TYPE].' },
    { title: '[TOOL/FRAMEWORK] Tutorial', desc: 'Learn tools', base: 'Complete tutorial for [TOOL/FRAMEWORK]. Show setup, basics, and advanced features.' },
    { title: '[PROBLEM] Solution', desc: 'Solve coding problems', base: 'How to solve [PROBLEM] in [LANGUAGE]. Show code examples and explanations.' },
    { title: '[ARCHITECTURE] Design Pattern', desc: 'Architecture knowledge', base: 'Explain [ARCHITECTURE] design pattern with real-world examples.' },
    { title: '[API] Integration Guide', desc: 'Connect to APIs', base: 'Step-by-step guide to integrate [API] into [PROJECT TYPE].' },
    { title: '[DATABASE] Optimization', desc: 'Speed up queries', base: 'Optimize [DATABASE] queries and indexes for [USE CASE].' },
    { title: '[LANGUAGE] vs [LANGUAGE]', desc: 'Compare languages', base: 'Compare [LANGUAGE] vs [LANGUAGE] for [USE CASE].' },
    { title: '[FRAMEWORK] Security', desc: 'Secure your code', base: 'Security best practices for [FRAMEWORK] applications.' },
    { title: '[TOOL] Troubleshooting', desc: 'Fix common issues', base: 'Common [TOOL] issues and how to fix them.' },
    { title: '[PATTERN] Implementation', desc: 'Code patterns', base: 'How to implement [PATTERN] in [LANGUAGE].' },
    { title: '[LIBRARY] Performance', desc: 'Optimize with libraries', base: '[LIBRARY] performance optimization techniques.' },
    { title: '[LANGUAGE] Memory Management', desc: 'Manage resources', base: 'Memory management in [LANGUAGE] and common pitfalls.' },
    { title: '[TESTING] Best Practices', desc: 'Write better tests', base: 'Best practices for [TESTING] in [LANGUAGE].' },
    { title: '[DEPLOYMENT] Setup', desc: 'Deploy your app', base: 'How to deploy [PROJECT TYPE] to [PLATFORM].' },
    { title: '[TOOL] Advanced Features', desc: 'Master tools', base: 'Advanced features of [TOOL] you probably didn\'t know.' },
  ];

  // Template variations for Physical Fitness
  const fitnessTemplates = [
    { title: '[GOAL] Workout Plan', desc: 'Custom workouts', base: 'Create a [DURATION] workout plan for [GOAL] at [FITNESS LEVEL].' },
    { title: '[EXERCISE] Form Guide', desc: 'Perfect your form', base: '[EXERCISE]: proper form, common mistakes, variations, and modifications.' },
    { title: '[GOAL] Nutrition Plan', desc: 'Eat for results', base: 'Create a [DURATION] meal plan for [GOAL]. Include macros and recipes.' },
    { title: '[GOAL] Supplement Stack', desc: 'Supplement guide', base: 'Recommended supplements for [GOAL]. Explain each one\'s benefits.' },
    { title: '[EQUIPMENT] Workout', desc: 'Use equipment', base: 'Full body workout using only [EQUIPMENT]. Include 10+ exercises.' },
    { title: '[GOAL] Progress Tracking', desc: 'Monitor progress', base: 'How to track progress toward [GOAL]. What metrics matter?' },
    { title: '[MUSCLE GROUP] Exercises', desc: 'Target muscles', base: '15 effective exercises for targeting [MUSCLE GROUP].' },
    { title: '[BODY TYPE] Training', desc: 'Tailor to your body', base: 'Best training approach for [BODY TYPE]. Explain why it works.' },
    { title: '[SPORT] Conditioning', desc: 'Sport-specific training', base: 'Conditioning and training plan for [SPORT].' },
    { title: '[GOAL] Recovery Tips', desc: 'Recover better', base: 'Recovery strategies for [GOAL] training. Sleep, nutrition, stretching.' },
    { title: '[AGE GROUP] Fitness', desc: 'Age-appropriate training', base: 'Best fitness practices for [AGE GROUP]. Safety and efficiency.' },
    { title: '[GOAL] Motivation Tips', desc: 'Stay committed', base: '20 motivation strategies to stay committed to [GOAL].' },
    { title: '[INJURY] Rehabilitation', desc: 'Recover from injury', base: 'Rehabilitation exercises for [INJURY]. Progress safely.' },
    { title: '[BODY COMPOSITION] Plan', desc: 'Transform your body', base: 'Complete plan for [BODY COMPOSITION] change. Training and nutrition.' },
    { title: '[GOAL] Home Setup', desc: 'Setup at home', base: 'Best home gym setup for [GOAL]. Equipment recommendations and budget options.' },
  ];

  // Template variations for Health & Wellness
  const wellnessTemplates = [
    { title: '[CONDITION] Wellness Plan', desc: 'Manage health', base: 'Comprehensive wellness plan for [CONDITION]. Lifestyle, diet, and habits.' },
    { title: '[GOAL] Sleep Optimization', desc: 'Sleep better', base: 'Sleep optimization guide for [GOAL]. Habits, schedule, and environment.' },
    { title: '[STRESS] Management', desc: 'Reduce stress', base: '[STRESS] management techniques. Practical exercises and daily routines.' },
    { title: '[CONDITION] Nutrition', desc: 'Eat for health', base: 'Nutritional guidelines for [CONDITION]. Foods to eat and avoid.' },
    { title: '[GOAL] Mental Health', desc: 'Improve mindset', base: 'Mental health practices for [GOAL]. Meditation, therapy, journaling.' },
    { title: '[VITAMIN] Benefits', desc: 'Vitamins explained', base: '[VITAMIN]: functions, deficiency symptoms, food sources, supplementation.' },
    { title: '[GOAL] Detox Plan', desc: 'Cleanse your body', base: '[DURATION] detox plan for [GOAL]. Safe, science-backed approach.' },
    { title: '[CONDITION] Home Remedies', desc: 'Natural solutions', base: '15 natural home remedies for [CONDITION] backed by research.' },
    { title: '[HABIT] Formation', desc: 'Build healthy habits', base: 'How to build [HABIT] in 30 days. Psychology and practical steps.' },
    { title: '[GOAL] Hydration Guide', desc: 'Proper hydration', base: 'Hydration guide for [GOAL]. How much water, when, and types.' },
    { title: '[MOOD] Boosting', desc: 'Improve mood', base: '20 science-backed ways to boost [MOOD] naturally.' },
    { title: '[AGE GROUP] Health', desc: 'Age-specific health', base: 'Health priorities and tips for [AGE GROUP].' },
    { title: '[GOAL] Immune Support', desc: 'Strengthen immunity', base: 'Immune system support plan for [GOAL]. Nutrients, habits, lifestyle.' },
    { title: '[BODY SYSTEM] Health', desc: 'Organ health', base: '[BODY SYSTEM] health optimization. Practices and preventive measures.' },
    { title: '[GOAL] Energy Boost', desc: 'Increase energy', base: 'How to naturally increase energy for [GOAL]. Diet, sleep, activity.' },
  ];

  // Template variations for Business & Marketing
  const businessTemplates = [
    { title: '[BUSINESS TYPE] Marketing Strategy', desc: 'Market your business', base: 'Complete marketing strategy for [BUSINESS TYPE]. Channels, budget, tactics.' },
    { title: '[PRODUCT] Launch Plan', desc: 'Launch successfully', base: '[PRODUCT] launch plan. Pre-launch, launch day, post-launch tactics.' },
    { title: '[AUDIENCE] Email Campaign', desc: 'Email marketing', base: 'Email campaign sequence for [AUDIENCE]. Copy, schedule, optimization.' },
    { title: '[GOAL] Social Strategy', desc: 'Social media plan', base: '[GOAL] social media strategy. Platforms, content, engagement, ads.' },
    { title: '[CONTENT TYPE] Creation', desc: 'Create content', base: 'How to create high-quality [CONTENT TYPE]. Process, tools, distribution.' },
    { title: '[BUSINESS] Pricing Strategy', desc: 'Price your offer', base: 'Pricing strategy for [BUSINESS]. Positioning, competitors, value.' },
    { title: '[CUSTOMER TYPE] Acquisition', desc: 'Get customers', base: '[CUSTOMER TYPE] acquisition strategy. Channels, costs, optimization.' },
    { title: '[GOAL] Sales Funnel', desc: 'Build a funnel', base: '[GOAL] sales funnel. Awareness, consideration, decision, retention.' },
    { title: '[PRODUCT] Positioning', desc: 'Position your offer', base: '[PRODUCT] market positioning. Unique value, messaging, differentiation.' },
    { title: '[BUSINESS] Partnership', desc: 'Strategic partnerships', base: 'How to create strategic partnerships for [BUSINESS]. Identification, negotiation.' },
    { title: '[GOAL] Brand Strategy', desc: 'Build your brand', base: '[GOAL] brand strategy. Identity, voice, visual, messaging.' },
    { title: '[METRIC] Analytics', desc: 'Track results', base: 'How to measure and optimize [METRIC] in marketing.' },
    { title: '[AUDIENCE] Content Calendar', desc: 'Plan content', base: '[DURATION] content calendar for [AUDIENCE]. Ideas, schedule, formats.' },
    { title: '[BUSINESS] Customer Retention', desc: 'Keep customers', base: 'Customer retention strategies for [BUSINESS]. Loyalty, engagement, value.' },
    { title: '[GOAL] Growth Hacking', desc: 'Rapid growth', base: '[GOAL] growth hacking ideas. Experiments, tactics, measurement.' },
  ];

  // Template variations for Creative Writing
  const writingTemplates = [
    { title: '[GENRE] Story Plot', desc: 'Create stories', base: 'Generate a unique [GENRE] story plot with 5 major plot points.' },
    { title: '[CHARACTER TYPE] Development', desc: 'Create characters', base: 'Develop a compelling [CHARACTER TYPE] character. Backstory, motivation, arc.' },
    { title: '[SETTING] World Building', desc: 'Build worlds', base: '[SETTING] world building. Geography, culture, history, magic system.' },
    { title: '[GENRE] Dialogue Writing', desc: 'Write dialogue', base: 'How to write compelling dialogue for [GENRE]. Techniques and examples.' },
    { title: '[THEME] Short Story', desc: 'Short story writing', base: 'Write a 1000-word [GENRE] short story exploring [THEME].' },
    { title: '[EMOTION] Scene Writing', desc: 'Write emotional scenes', base: 'How to write scenes that evoke [EMOTION]. Techniques, examples, editing.' },
    { title: '[POV] Narrative Technique', desc: 'Choose perspective', base: '[POV] narrative technique. Advantages, disadvantages, when to use.' },
    { title: '[CONFLICT TYPE] Development', desc: 'Create conflict', base: 'Develop compelling [CONFLICT TYPE] in your story. Escalation, resolution.' },
    { title: '[GENRE] Worldbuilding Bible', desc: 'Document your world', base: 'Create a worldbuilding bible for [GENRE] fiction.' },
    { title: '[WRITING GOAL] Improvement', desc: 'Improve writing', base: 'How to improve [WRITING GOAL] in your creative writing.' },
    { title: '[GENRE] Tropes & Subversions', desc: 'Use tropes cleverly', base: '[GENRE] tropes: common ones, subversions, when to use each.' },
    { title: '[STORY ELEMENT] Enhancement', desc: 'Enhance elements', base: 'How to make [STORY ELEMENT] more compelling in fiction.' },
    { title: '[WRITING CHALLENGE] Solving', desc: 'Overcome challenges', base: 'How to solve common [WRITING CHALLENGE] in creative writing.' },
    { title: '[GENRE] Writing Craft', desc: 'Learn techniques', base: '[GENRE] writing craft. Techniques, pacing, structure unique to genre.' },
    { title: '[CHARACTER RELATIONSHIP] Dynamics', desc: 'Develop relationships', base: 'Create dynamic [CHARACTER RELATIONSHIP] with depth and growth.' },
  ];

  // Template variations for Productivity
  const productivityTemplates = [
    { title: '[GOAL] Time Management', desc: 'Manage time', base: 'Time management system for [GOAL]. Techniques, tools, daily routine.' },
    { title: '[PROJECT TYPE] Planning', desc: 'Plan projects', base: '[PROJECT TYPE] planning framework. Steps, timeline, resources, risks.' },
    { title: '[DISTRACTION] Elimination', desc: 'Eliminate distractions', base: '[DISTRACTION] elimination strategies. Techniques, environment, tools.' },
    { title: '[GOAL] Habit Stack', desc: 'Stack habits', base: 'Create a [DURATION] habit stack for [GOAL]. Daily routine, triggers.' },
    { title: '[PRODUCTIVITY METHOD] Guide', desc: 'Learn methods', base: '[PRODUCTIVITY METHOD] explained. How to use, benefits, drawbacks.' },
    { title: '[TASK] Prioritization', desc: 'Prioritize tasks', base: 'How to prioritize [TASK] effectively. Frameworks, tools, decision-making.' },
    { title: '[GOAL] Goal Setting', desc: 'Set goals properly', base: '[GOAL] goal-setting framework. SMART goals, milestones, tracking.' },
    { title: '[WORKFLOW] Optimization', desc: 'Optimize workflow', base: '[WORKFLOW] optimization. Automation, batching, elimination.' },
    { title: '[TOOL] Productivity', desc: 'Use tools effectively', base: '[TOOL] setup for productivity. Best practices, automation, integrations.' },
    { title: '[ENERGY LEVEL] Scheduling', desc: 'Energy-based scheduling', base: 'Schedule [GOAL] based on [ENERGY LEVEL]. When to work on what.' },
    { title: '[PROCRASTINATION] Solution', desc: 'Beat procrastination', base: '[PROCRASTINATION] psychology and solutions. Techniques to take action.' },
    { title: '[FOCUS] Deep Work', desc: 'Deep work guide', base: 'Deep work system for [FOCUS]. Environment, duration, recovery.' },
    { title: '[GOAL] Motivation', desc: 'Stay motivated', base: '20 motivation strategies for maintaining [GOAL] long-term.' },
    { title: '[DECISION] Making', desc: 'Make decisions fast', base: '[DECISION] decision-making framework. Speed, quality, reversibility.' },
    { title: '[FAILURE] Recovery', desc: 'Bounce back', base: 'How to recover from [FAILURE] and get back to productivity.' },
  ];

  // Template variations for Language Learning
  const languageTemplates = [
    { title: '[LANGUAGE] Learning Plan', desc: 'Learn languages', base: '[DURATION] learning plan for [LANGUAGE]. Methods, resources, schedule.' },
    { title: '[LANGUAGE] Pronunciation', desc: 'Pronounce correctly', base: '[LANGUAGE] pronunciation guide. Sounds, practice, resources.' },
    { title: '[LANGUAGE] Grammar', desc: 'Learn grammar', base: '[LANGUAGE] grammar explanation for [GRAMMAR TOPIC]. Rules, examples, practice.' },
    { title: '[LANGUAGE] Vocabulary', desc: 'Build vocabulary', base: '[VOCABULARY THEME] vocabulary for [LANGUAGE]. 50+ words with context.' },
    { title: '[LANGUAGE] Speaking Practice', desc: 'Practice speaking', base: 'Conversation practice prompts for [LANGUAGE]. Topics, scenarios, phrases.' },
    { title: '[LANGUAGE] Listening', desc: 'Improve listening', base: '[LANGUAGE] listening comprehension guide. Techniques, resources, practice.' },
    { title: '[LANGUAGE] Writing', desc: 'Practice writing', base: '[LANGUAGE] writing exercises. Grammar, vocabulary, fluency building.' },
    { title: '[LANGUAGE] Cultural Tips', desc: 'Learn culture', base: '[LANGUAGE] cultural context. Customs, etiquette, cultural references.' },
    { title: '[LANGUAGE] Test Prep', base: '[LANGUAGE] [TEST NAME] preparation guide. Format, timing, strategies.' },
    { title: '[LANGUAGE] Business', base: 'Business [LANGUAGE]. Terminology, etiquette, communication.' },
    { title: '[LANGUAGE] Accent Reduction', base: 'Reduce [LANGUAGE] accent. Techniques, common issues, practice.' },
    { title: '[LANGUAGE] Idioms', base: '30 common [LANGUAGE] idioms with meanings and usage examples.' },
    { title: '[LANGUAGE] Movie/Show Guide', base: '[LANGUAGE] language learning through [CONTENT TYPE]. Series, techniques, resources.' },
    { title: '[LANGUAGE] Immersion', base: 'Create [LANGUAGE] immersion environment. Techniques, content, communities.' },
    { title: '[LANGUAGE] Tutor Tips', base: 'Find [LANGUAGE] tutor effectively. What to look for, questions to ask.' },
  ];

  // Template variations for Art & Design
  const artTemplates = [
    { title: '[DESIGN TYPE] Brief', desc: 'Create design briefs', base: '[DESIGN TYPE] design brief template for [PROJECT]. Goals, constraints, inspiration.' },
    { title: '[DESIGN ELEMENT] Principles', desc: 'Design principles', base: '[DESIGN ELEMENT] principles explained with examples for [STYLE].' },
    { title: '[COLOR PALETTE] Design', desc: 'Choose colors', base: 'Create a [MOOD] color palette for [DESIGN TYPE]. Psychology, usage.' },
    { title: '[DESIGN STYLE] Guide', desc: 'Learn styles', base: '[DESIGN STYLE] explained. History, characteristics, modern applications.' },
    { title: '[TOOL] Design Tutorial', desc: 'Learn design tools', base: '[TOOL] tutorial for [DESIGN TYPE]. Basics, advanced features, tips.' },
    { title: '[DESIGN TYPE] Trends', desc: 'Stay current', base: '[YEAR] design trends for [DESIGN TYPE]. What\'s hot, predictions, examples.' },
    { title: '[BRAND] Visual Identity', desc: 'Create brand identity', base: '[BRAND] visual identity system. Logo, colors, typography, guidelines.' },
    { title: '[DESIGN TYPE] Composition', desc: 'Master composition', base: 'Composition principles for [DESIGN TYPE]. Layout, balance, hierarchy.' },
    { title: '[TYPOGRAPHY] Guide', desc: 'Master typography', base: '[TYPOGRAPHY] guide for [DESIGN TYPE]. Pairing, sizing, hierarchy.' },
    { title: '[ASSET TYPE] Creation', desc: 'Create design assets', base: 'How to create professional [ASSET TYPE] for [DESIGN TYPE].' },
    { title: '[DESIGN PROBLEM] Solution', desc: 'Solve design problems', base: 'How to solve [DESIGN PROBLEM] creatively in [DESIGN TYPE].' },
    { title: '[STYLE] Modern Design', desc: 'Modern design', base: '[STYLE] in modern design. Characteristics, tools, inspiration.' },
    { title: '[DESIGN ELEMENT] Mastery', desc: 'Master elements', base: '[DESIGN ELEMENT] mastery in [DESIGN TYPE]. Theory, practice, examples.' },
    { title: '[PORTFOLIO] Tips', desc: 'Build portfolio', base: 'How to build an impressive [DESIGN TYPE] portfolio. Projects, presentation.' },
    { title: '[CLIENT] Design Process', desc: 'Work with clients', base: '[DESIGN TYPE] design process for [CLIENT]. Discovery, iteration, delivery.' },
  ];

  // Template variations for Finance & Investing
  const financeTemplates = [
    { title: '[GOAL] Financial Plan', desc: 'Plan finances', base: '[DURATION] financial plan for [GOAL]. Budget, savings, investment strategy.' },
    { title: '[INVESTMENT TYPE] Guide', desc: 'Invest wisely', base: '[INVESTMENT TYPE] investment guide for [RISK LEVEL]. Risks, returns, strategies.' },
    { title: '[GOAL] Budgeting', desc: 'Budget effectively', base: '[BUDGET TYPE] budgeting system for [GOAL]. Allocation, tracking, optimization.' },
    { title: '[FINANCIAL GOAL] Roadmap', desc: 'Achieve goals', base: 'Roadmap to [FINANCIAL GOAL]. Timeline, actions, milestones.' },
    { title: '[DEBT] Management', desc: 'Manage debt', base: '[DEBT TYPE] debt management strategy. Payoff plans, tactics, psychology.' },
    { title: '[INCOME STREAM] Creation', desc: 'Build income streams', base: 'How to create [INCOME STREAM]. Execution, marketing, scaling.' },
    { title: '[TAX] Optimization', desc: 'Reduce taxes', base: '[TAX] optimization strategies for [SITUATION]. Legal, ethical, effective.' },
    { title: '[ASSET] Allocation', desc: 'Allocate assets', base: '[ASSET] allocation strategy for [GOAL]. Percentages, rebalancing, risks.' },
    { title: '[MARKET] Analysis', desc: 'Analyze markets', base: 'How to analyze [MARKET] for [INVESTMENT TYPE] opportunities.' },
    { title: '[CRYPTO] Guide', desc: 'Understand crypto', base: '[CRYPTO] explained. Technology, investment, risks, future.' },
    { title: '[INSURANCE] Guide', desc: 'Get insured', base: '[INSURANCE TYPE] insurance guide. Coverage, costs, decision factors.' },
    { title: '[RETIREMENT] Planning', desc: 'Plan retirement', base: '[RETIREMENT TYPE] retirement planning. Savings, strategies, lifestyle.' },
    { title: '[NEGOTIATION] Tips', desc: 'Negotiate finances', base: '[NEGOTIATION TYPE] negotiation for [FINANCIAL GOAL]. Tactics, psychology.' },
    { title: '[FINANCIAL HABIT] Formation', desc: 'Build habits', base: 'Build [FINANCIAL HABIT] in 30 days. Psychology, systems, tracking.' },
    { title: '[WEALTH] Building', desc: 'Build wealth', base: '[WEALTH LEVEL] wealth building roadmap. Income, saving, investing.' },
  ];

  // Template variations for Cooking & Recipes
  const cookingTemplates = [
    { title: '[CUISINE] Recipe', desc: 'Cook like a pro', base: 'Detailed [CUISINE] recipe for [DISH]. Ingredients, steps, tips, variations.' },
    { title: '[DIET TYPE] Meal Plan', desc: 'Plan meals', base: '[DURATION] [DIET TYPE] meal plan for [GOAL]. Recipes, shopping list, prep.' },
    { title: '[COOKING TECHNIQUE] Guide', desc: 'Learn techniques', base: '[COOKING TECHNIQUE] explained. Process, tips, common mistakes, recipes.' },
    { title: '[INGREDIENT] Substitutions', desc: 'Substitute ingredients', base: '[INGREDIENT] substitutes for [DIETARY NEED]. Ratios, flavors, results.' },
    { title: '[MEAL TYPE] Ideas', desc: 'Meal inspiration', base: '20 [MEAL TYPE] ideas for [DIETARY PREFERENCE]. Quick, healthy, delicious.' },
    { title: '[CUISINE] Cooking Basics', desc: 'Learn cuisine', base: '[CUISINE] cooking basics. Essential ingredients, techniques, flavor profiles.' },
    { title: '[DISH] Perfection', desc: 'Master dishes', base: 'How to make perfect [DISH]. Professional tips, common issues, variations.' },
    { title: '[EQUIPMENT] Guide', desc: 'Cook with tools', base: '[EQUIPMENT] guide for [COOKING STYLE]. Features, uses, recommendations.' },
    { title: '[SPICE] Flavoring', desc: 'Master flavors', base: '[SPICE/FLAVORING] flavor profile. Uses, pairings, substitutes, recipes.' },
    { title: '[DIETARY NEED] Cooking', desc: 'Cook for diets', base: 'Cooking for [DIETARY NEED]. Techniques, recipes, nutrition tips.' },
    { title: '[KITCHEN SKILL] Mastery', desc: 'Improve skills', base: '[KITCHEN SKILL] mastery. Techniques, practice, recipes for improvement.' },
    { title: '[MEAL PREP] Guide', desc: 'Prep meals', base: '[DURATION] meal prep guide for [GOAL]. Shopping, cooking, storage, recipes.' },
    { title: '[LEFTOVER] Ideas', desc: 'Use leftovers', base: '10 creative ways to use [LEFTOVER]. Transform, repurpose, recipes.' },
    { title: '[PARTY] Menu', desc: 'Plan parties', base: '[PARTY TYPE] menu for [GUEST COUNT]. Recipes, timing, prep strategy.' },
    { title: '[COOKING PROBLEM] Solution', desc: 'Solve issues', base: 'How to fix [COOKING PROBLEM]. Techniques, prevention, salvage methods.' },
  ];

  // Template variations for Career & Resume
  const careerTemplates = [
    { title: '[JOB TITLE] Interview', desc: 'Interview prep', base: '[JOB TITLE] interview preparation. Common questions, answers, tips.' },
    { title: '[SKILL] Development', desc: 'Build skills', base: '[SKILL] development plan. Learning resources, practice, projects.' },
    { title: '[RESUME] Optimization', desc: 'Perfect resume', base: '[JOB FIELD] resume optimization. Format, keywords, achievements, ATS.' },
    { title: '[CAREER TRANSITION] Guide', desc: 'Change careers', base: '[CAREER TRANSITION] guide. Steps, skills, networking, timing.' },
    { title: '[INDUSTRY] Trends', desc: 'Stay current', base: '[INDUSTRY] industry trends [YEAR]. What\'s changing, skills in demand.' },
    { title: '[ROLE] Responsibilities', desc: 'Understand role', base: '[ROLE] role guide. Responsibilities, skills, career path, salary.' },
    { title: '[NEGOTIATION] Salary', desc: 'Negotiate pay', base: '[POSITION TYPE] salary negotiation. Research, tactics, responses, walk-away.' },
    { title: '[NETWORKING] Strategy', desc: 'Build network', base: '[INDUSTRY] networking strategy. Events, LinkedIn, referrals, outreach.' },
    { title: '[COVER LETTER] Writing', desc: 'Write letters', base: '[JOB TITLE] cover letter template and writing guide.' },
    { title: '[PORTFOLIO] Building', desc: 'Showcase work', base: '[FIELD] portfolio building guide. Projects, platforms, presentation.' },
    { title: '[MENTOR] Finding', desc: 'Find mentors', base: 'How to find and approach [INDUSTRY] mentors. Strategy, questions, value.' },
    { title: '[PROFESSIONAL] Branding', desc: 'Build brand', base: '[FIELD] personal branding. LinkedIn, content, visibility, authority.' },
    { title: '[ADVANCEMENT] Path', desc: 'Get promoted', base: '[ROLE] advancement path. Skills, visibility, timing, negotiation.' },
    { title: '[WORK PROBLEM] Solution', desc: 'Solve conflicts', base: '[WORK PROBLEM] solutions. Strategies, communication, escalation.' },
    { title: '[REMOTE] Work', desc: 'Work remotely', base: '[JOB TYPE] remote work guide. Tools, practices, productivity, culture.' },
  ];

  const categories = {
    'Study & Learning': studyTemplates,
    'Instagram Trending': instagramTemplates,
    'Software Development': devTemplates,
    'Physical Fitness': fitnessTemplates,
    'Health & Wellness': wellnessTemplates,
    'Business & Marketing': businessTemplates,
    'Creative Writing': writingTemplates,
    'Productivity': productivityTemplates,
    'Language Learning': languageTemplates,
    'Art & Design': artTemplates,
    'Finance & Investing': financeTemplates,
    'Cooking & Recipes': cookingTemplates,
    'Career & Resume': careerTemplates,
  };

  // Generate prompts for each category
  Object.keys(categories).forEach((categoryName) => {
    const categoryId = categoryMap[categoryName];
    const templates = categories[categoryName];

    // Generate 1000+ prompts per category
    for (let i = 0; i < 77; i++) {
      templates.forEach((template, idx) => {
        // Create multiple variations for each template
        const variations = [
          { suffix: '', variant: i },
          { suffix: ' Advanced', variant: i + 1000 },
          { suffix: ' Quick', variant: i + 2000 },
          { suffix: ' Comprehensive', variant: i + 3000 },
          { suffix: ' for Beginners', variant: i + 4000 },
          { suffix: ' Masterclass', variant: i + 5000 },
          { suffix: ' Deep Dive', variant: i + 6000 },
          { suffix: ' Pro Tips', variant: i + 7000 },
          { suffix: ' Simplified', variant: i + 8000 },
          { suffix: ' Complete Guide', variant: i + 9000 },
          { suffix: ' Step-by-Step', variant: i + 10000 },
          { suffix: ' Expert Level', variant: i + 11000 },
          { suffix: ' Quick Start', variant: i + 12000 },
          { suffix: ' Full Tutorial', variant: i + 13000 },
        ];

        variations.forEach((v) => {
          const difficulty = difficulties[v.variant % difficulties.length];
          const aiModel = aiModels[v.variant % aiModels.length];
          const title = template.title ? `${template.title}${v.suffix}` : `${categoryName} Guide ${v.variant}`;
          const baseSlug = slugify(title, { lower: true, strict: true });
          const slug = `${baseSlug}-${v.variant}-${idx}`;

          const prompt = {
            title,
            slug, // Add unique slug
            content: `${template.base || template.title} (Variant: ${v.variant})`,
            description: template.desc ? `${template.desc}${v.suffix.toLowerCase()}` : `Learn about ${categoryName}`,
            category: categoryId,
            tags: [categoryName.toLowerCase().replace(/\s+/g, '-'), difficulty, `v${v.variant}`],
            difficulty,
            aiModel,
            isFeatured: v.variant % 50 === 0, // Feature some prompts
          };

          prompts.push(prompt);
        });
      });
    }
  });

  return prompts;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/promptvault');

    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Category.deleteMany({}),
      Prompt.deleteMany({}),
      Admin.deleteMany({}),
    ]);

    // Create categories
    const categoriesData = [
      { name: 'Study & Learning', icon: '📚', color: '#FF6B6B', description: 'Academic and learning resources' },
      { name: 'Instagram Trending', icon: '📱', color: '#E1306C', description: 'Social media and viral content' },
      { name: 'Software Development', icon: '💻', color: '#4A90E2', description: 'Coding and software engineering' },
      { name: 'Physical Fitness', icon: '💪', color: '#50C878', description: 'Workout and exercise routines' },
      { name: 'Health & Wellness', icon: '🏥', color: '#FF9800', description: 'Health tips and wellness guides' },
      { name: 'Business & Marketing', icon: '📊', color: '#9C27B0', description: 'Business strategy and marketing' },
      { name: 'Creative Writing', icon: '✍️', color: '#FF1493', description: 'Writing and storytelling' },
      { name: 'Productivity', icon: '⚡', color: '#FFD700', description: 'Time management and productivity' },
      { name: 'Language Learning', icon: '🌍', color: '#00BCD4', description: 'Language learning resources' },
      { name: 'Art & Design', icon: '🎨', color: '#8B4513', description: 'Design and creative projects' },
      { name: 'Finance & Investing', icon: '💰', color: '#32CD32', description: 'Financial planning and investing' },
      { name: 'Cooking & Recipes', icon: '🍳', color: '#FF6347', description: 'Recipes and cooking tips' },
      { name: 'Career & Resume', icon: '👔', color: '#4169E1', description: 'Career development and interviews' },
    ];

    const createdCategories = await Category.create(categoriesData);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    console.log(`✅ Created ${createdCategories.length} categories`);

    // Generate and create prompts
    const prompts = generateMassivePrompts(categoryMap);
    const createdPrompts = await Prompt.insertMany(prompts);
    console.log(`✅ Created ${createdPrompts.length} prompts (1000+ per category)`);

    // Create admin accounts
    const admin1 = await Admin.create({
      name: 'PromptVault Admin',
      email: 'admin@promptvault.com',
      password: 'Admin@123456',
      role: 'superadmin',
    });

    const admin2 = await Admin.create({
      name: 'PromptCraftery Admin',
      email: 'admin@promptcraftery.com',
      password: 'Admin@123456',
      role: 'superadmin',
    });

    console.log(`✅ Created admin@promptvault.com`);
    console.log(`✅ Created admin@promptcraftery.com`);

    console.log('\n🎉 Database massive restoration complete!');
    console.log(`Total prompts: ${createdPrompts.length}`);
    console.log(`Average per category: ${Math.floor(createdPrompts.length / 13)}`);
    console.log(`Admins created:`);
    console.log(`- admin@promptvault.com / Admin@123456`);
    console.log(`- admin@promptcraftery.com / Admin@123456`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
