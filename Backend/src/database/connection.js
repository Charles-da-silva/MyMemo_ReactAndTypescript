// Responsável pela conexão com PostgreSQL

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'MyMemoDB',
  password: 'senha123',
  port: 5432,
});

pool.connect()
  .then(() => console.log('Banco conectado!'))
  .catch((err) => console.log(err));

module.exports = pool;