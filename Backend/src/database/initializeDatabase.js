const db = require('./connection');

async function initializeDatabase() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS app_users (
      firebase_uid TEXT PRIMARY KEY,
      email TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    ALTER TABLE decks
    ADD COLUMN IF NOT EXISTS owner_id TEXT REFERENCES app_users(firebase_uid)
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_decks_owner_id ON decks(owner_id)
  `);
}

module.exports = initializeDatabase;
