const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'starter', 'pro', 'premium'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active'
    },
    startDate: Date,
    endDate: Date,
    price: {
      type: Number,
      default: 0
    },
    promptsLimit: {
      type: Number,
      default: 5 // Free: 5, Starter: 25, Pro: 100, Premium: 400
    }
  },
  promptsUsed: {
    type: Number,
    default: 0
  },
  copiedPrompts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prompt',
    default: []
  }],
  freeTrialUsed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update prompt usage for unique prompt copies
userSchema.methods.recordPromptCopy = async function(promptId) {
  if (!this.copiedPrompts) {
    this.copiedPrompts = [];
  }
  
  const alreadyCopied = this.copiedPrompts.some(id => id.toString() === promptId.toString());
  if (alreadyCopied) {
    return false;
  }

  this.copiedPrompts.push(promptId);
  this.promptsUsed += 1;
  await this.save();
  return true;
};

userSchema.methods.hasCopiedPrompt = function(promptId) {
  if (!this.copiedPrompts || this.copiedPrompts.length === 0) {
    return false;
  }
  return this.copiedPrompts.some(id => id.toString() === promptId.toString());
};

// Check if user can access more prompts for a given prompt
userSchema.methods.canAccessMorePrompts = function(promptId) {
  const plan = this.subscription?.plan || 'free';
  const limit = this.subscription?.promptsLimit || 5;
  
  // Allow copying if already copied (don't count twice)
  const alreadyCopied = this.hasCopiedPrompt(promptId);
  if (alreadyCopied) {
    return true;
  }

  // Block if limit reached
  return this.promptsUsed < limit;
};

module.exports = mongoose.model('User', userSchema);
