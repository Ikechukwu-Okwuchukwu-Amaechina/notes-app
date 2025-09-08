require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();

// basic middlewares
app.use(express.json());
app.use(require('./middleware/logger'));
app.use(helmet());

// serve static frontend under /public so / remains a JSON health check
app.use('/public', express.static(path.join(__dirname, 'public')));

// health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Notes API' });
});

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Only start the server if this file is run directly (not when required by tests)
if (require.main === module) {
  const { connectDb } = require('./config/db');
  const PORT = process.env.PORT || 3000;
  connectDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB', err);
      process.exit(1);
    });
}

module.exports = app;
