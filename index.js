require('dotenv').config();
const express = require('express');

const app = express();

// basic middlewares
app.use(express.json());

// health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Notes API' });
});

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Only start the server if this file is run directly (not when required by tests)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
