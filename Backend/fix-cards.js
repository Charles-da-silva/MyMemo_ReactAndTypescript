require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5433'),
  database: process.env.DATABASE_NAME,
});

async function fixCards() {
  try {
    console.log('Conectando ao banco...');
    const result = await pool.query(`
      UPDATE cards
      SET next_review = NOW()
      WHERE next_review > NOW() + INTERVAL '1 hour'
    `);
    console.log(`Cards atualizados: ${result.rowCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error.message);
    process.exit(1);
  }
}

fixCards();
