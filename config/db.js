const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI ;

async function connectDb() {
  try {
    if (mongoose.connection.readyState === 1) return mongoose.connection;
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

async function disconnectDb() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

module.exports = { connectDb, disconnectDb };
