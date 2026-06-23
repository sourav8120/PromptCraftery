const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const dns = require('dns');

// Configure DNS to use Google's public DNS servers (fixes MongoDB SRV lookup issues)
dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('🔧 DNS Configured: Using Google DNS (8.8.8.8, 8.8.4.4)');

// Load environment variables from .env file
dotenv.config();

// Debug: Check if MONGODB_URI is loaded
console.log('🔍 Environment Check:');
console.log('   - MONGODB_URI:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ NOT FOUND');
console.log('   - PORT:', process.env.PORT || 5001);
console.log('   - NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' }
});

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/', limiter);

// Static files for uploads
app.use('/uploads', express.static('public/uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/google-auth', require('./routes/google-auth'));
app.use('/api/subscription', require('./routes/subscription'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/prompts', require('./routes/prompts'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler for multer and other errors
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({ error: 'File is too large. Maximum size is 5MB.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files.' });
    }
  }
  
  // Handle custom validation errors
  if (err.message) {
    return res.status(400).json({ error: err.message });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
    });
    console.log('✅ MongoDB connected successfully!');
    console.log('   - Database:', mongoose.connection.db.databaseName);
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection error (will retry):');
    console.error('   - Code:', err.code);
    console.error('   - Message:', err.message);
    return false;
  }
};

// Start server first, connect to MongoDB in background
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Try to connect to MongoDB
  let connected = false;
  for (let i = 0; i < 5; i++) {
    connected = await connectDB();
    if (connected) break;
    console.log(`⏳ Retrying in 3 seconds... (Attempt ${i + 1}/5)`);
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  if (!connected) {
    console.warn('⚠️  Database connection failed. Running in degraded mode.');
  }
});
