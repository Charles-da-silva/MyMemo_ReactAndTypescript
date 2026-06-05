require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const pool = require('./database/connection');
const crypto = require('crypto');

async function test() {
  try {
    const id = crypto.randomUUID();
    const result = await pool.query(
      `INSERT INTO cards (id, deck_id, question, correct_answer, next_review, alternatives, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        id,
        '550e8400-e29b-41d4-a716-446655440000',
        'What is 2+2?',
        '4',
        null,
        JSON.stringify([]),
        null
      ]
    );
    console.log('✅ SUCCESS! Card created:', result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
}

test();
