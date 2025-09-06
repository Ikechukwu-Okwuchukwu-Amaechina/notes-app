const fs = require('fs');
const path = require('path');

// Allow overriding DB file for tests via env var DB_FILE. Defaults to data/db.json
const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'data', 'db.json');

function ensureDb() {
  if (!fs.existsSync(dbFile)) {
    const initial = { users: [], notes: [] };
    fs.writeFileSync(dbFile, JSON.stringify(initial, null, 2));
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(dbFile, 'utf8');
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

module.exports = {
  readDb,
  writeDb,
};
