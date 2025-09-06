// Common test setup
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';
// Use a temp DB file per run
const path = require('path');
const os = require('os');
const fs = require('fs');

const dbDir = path.join(os.tmpdir(), 'notes-app-tests');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
process.env.DB_FILE = path.join(dbDir, `db-${Date.now()}.json`);
