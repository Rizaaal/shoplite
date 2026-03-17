const db = require('../config/db');
const bcrypt = require('bcrypt');

const mapCliente = (row) => {
  return {
    id: row.id_cliente,
    nome: row.nome,
    cognome: row.cognome,
    email: row.email,
    indirizzo: row.indirizzo,
    role: row.role,
    createdAt: row.created_at,
  };
};

const getAllClienti = async () => {
  const [rows] = await db.query(`
    SELECT
      id_cliente,
      nome,
      cognome,
      email,
      indirizzo,
      role,
      created_at
    FROM clienti
    ORDER BY id_cliente DESC
  `);

  return rows.map(mapCliente);
};

const getClienteById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT
      id_cliente,
      nome,
      cognome,
      email,
      indirizzo,
      role,
      created_at
    FROM clienti
    WHERE id_cliente = ?
    LIMIT 1
    `,
    [id],
  );

  if (rows.length === 0) {
    return null;
  }

  return mapCliente(rows[0]);
};

const createCliente = async ({
  nome,
  cognome,
  email,
  indirizzo = null,
  role = 'user',
  password,
}) => {
  const hashedPassword = await bcrypt.hash(password, 10)

  const [result] = await db.query(
    `
    INSERT INTO clienti (
      nome,
      cognome,
      email,
      indirizzo,
      role,
      password
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [nome, cognome, email, indirizzo, role, hashedPassword],
  );

  return getClienteById(result.insertId);
};

const deleteClienteById = async (id) => {
  const [result] = await db.query('DELETE FROM clienti WHERE id_cliente = ?', [id]);

  return result.affectedRows > 0;
};

module.exports = {
  getAllClienti,
  getClienteById,
  createCliente,
  deleteClienteById,
};
