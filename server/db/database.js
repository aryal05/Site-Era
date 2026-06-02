const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'siteera.db');
const db = new Database(dbPath);

// Initialize database with schema
const initDB = () => {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);
  console.log('✅ Database initialized');
};

// Initialize on first run
initDB();

module.exports = db;
