const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = process.env.DB_DIR || path.join(__dirname, '..', 'db');
const dbPath = process.env.DB_PATH || path.join(dbDir, 'mahasiswa.db');

fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS mahasiswa (
    nim INTEGER PRIMARY KEY,
    nama TEXT NOT NULL,
    program_studi TEXT NOT NULL,
    angkatan INTEGER NOT NULL,
    ipk REAL NOT NULL
  )
`);

module.exports = db;
