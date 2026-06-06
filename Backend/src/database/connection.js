// Responsável pela conexão com PostgreSQL

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('Banco conectado!'))
  .catch((err) => console.log(err));

module.exports = pool;