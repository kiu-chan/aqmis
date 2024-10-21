const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'thai_nguyen_air_quality_db',
  password: '123456',
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};