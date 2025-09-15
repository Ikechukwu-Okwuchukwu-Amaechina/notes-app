// Compatibility wrapper so tests and models can import from models/db
const mongoose = require('mongoose');
const { connectDb, disconnectDb } = require('../config/db');

module.exports = {
  mongoose,
  connectDb,
  disconnectDb,
};
