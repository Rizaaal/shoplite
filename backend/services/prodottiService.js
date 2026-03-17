const db = require('../config/db');

const mapProdotto = (row) => {
  return {
    id: row.id_prodotto,
    nome: row.nome,
    descrizione: row.descrizione,
    prezzo: Number(row.prezzo),
    stock: row.stock,
    categoria: row.categoria,
    image: row.image,
    createdAt: row.created_at,
  };
};

const getAllProdotti = async () => {
  const [rows] = await db.query(`
    SELECT
      id_prodotto,
      nome,
      descrizione,
      prezzo,
      stock,
      categoria,
      image,
      created_at
    FROM prodotti
    ORDER BY id_prodotto DESC
  `);

  return rows.map(mapProdotto);
};

const getProdottoById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT
      id_prodotto,
      nome,
      descrizione,
      prezzo,
      stock,
      categoria,
      image,
      created_at
    FROM prodotti
    WHERE id_prodotto = ?
    LIMIT 1
    `,
    [id],
  );

  if (rows.length === 0) {
    return null;
  }

  return mapProdotto(rows[0]);
};

const getProdottiByCategoria = async (categoria) => {
  const [rows] = await db.query(
    `
    SELECT
      id_prodotto,
      nome,
      descrizione,
      prezzo,
      stock,
      categoria,
      image,
      created_at
    FROM prodotti
    WHERE LOWER(categoria) = LOWER(?)
    ORDER BY id_prodotto DESC
    `,
    [categoria],
  );

  return rows.map(mapProdotto);
};

const createProdotto = async ({
  nome,
  descrizione,
  prezzo,
  stock = 0,
  categoria,
  image = null,
}) => {
  const [result] = await db.query(
    `
    INSERT INTO prodotti (
      nome,
      descrizione,
      prezzo,
      stock,
      categoria,
      image
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [nome, descrizione, prezzo, stock, categoria, image],
  );

  return getProdottoById(result.insertId);
};

const deleteProdottoById = async (id) => {
  const [result] = await db.query('DELETE FROM prodotti WHERE id_prodotto = ?', [id]);

  return result.affectedRows > 0;
};

module.exports = {
  getAllProdotti,
  getProdottoById,
  getProdottiByCategoria,
  createProdotto,
  deleteProdottoById,
};
