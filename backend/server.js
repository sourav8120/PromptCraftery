const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const dns = require('dns');

// Configure DNS to use Google's public DNS servers (fixes MongoDB SRV lookup issues)
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables from .env file
dotenv.config();

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

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/subscription', require('./routes/subscription'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/prompts', require('./routes/prompts'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Singleton MongoDB connection pool
let mongooseConnection = null;

const connectDB = async () => {
  if (mongooseConnection && mongoose.connection.readyState === 1) {
    return mongooseConnection;
  }
  
  try {
    mongooseConnection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      maxPoolSize: 1,
    });
    return mongooseConnection;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

// Middleware to ensure DB connection before routes
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  next();
});

// For local development
const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    try {
      await connectDB();
      console.log('✅ MongoDB connected successfully!');
    } catch (err) {
      console.error('❌ Failed to connect to MongoDB:', err.message);
    }
  });
}

// Export for Vercel serverless functions
module.exports = app;
