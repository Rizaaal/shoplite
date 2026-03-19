const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shoplite',
  port: Number(process.env.DB_PORT) || 8889,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(config).promise();

async function initDB(fileName) {
  const sqlPath = path.join(__dirname, fileName);
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await pool.query(statement);
  }
}

async function connectDB() {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL connesso');
    connection.release();

    await initDB('../shoplite-2.sql');
    console.log('Init DB completata');
  } catch (err) {
    console.error('Errore connessione o init DB:', err);
  }
}

connectDB();

module.exports = pool;
