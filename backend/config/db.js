const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shoplite',
  port: Number(process.env.DB_PORT) || 8889,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Errore connessione DB completo:', err);
    return;
  }

  console.log('MySQL connesso');
  connection.release();
});

module.exports = pool.promise();
