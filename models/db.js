const mongoose = require('mongoose');
const { connectDb, disconnectDb } = require('../config/db');

module.exports = {
  mongoose,
  connectDb,
  disconnectDb,
};
