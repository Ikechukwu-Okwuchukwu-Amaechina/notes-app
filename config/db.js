const mongoose = require('mongoose');

async function connectDb(uri) {
  try {
    const mongoUri = uri || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MongoDB URI is not defined');
    }

    if (mongoose.connection.readyState === 1) return mongoose.connection;

    await mongoose.connect(mongoUri);
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

module.exports = { connectDb, disconnectDb, mongoose };
