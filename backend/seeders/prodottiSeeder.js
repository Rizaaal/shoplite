async function seedProdottiIfEmpty(db) {
  const [rows] = await db.query('SELECT COUNT(*) AS count FROM prodotti');
  const count = rows[0].count;

  if (count > 0) {
    console.log('Seed prodotti saltato: tabella già popolata');
    return;
  }

  await db.query(`
    INSERT INTO prodotti (nome, descrizione, prezzo, stock, categoria, image)
    VALUES
      ('RTX 4070', 'Scheda video NVIDIA ad alte prestazioni', 599.99, 10, 'GPU', 'https://via.placeholder.com/300'),
      ('Ryzen 7 7800X3D', 'Processore AMD per gaming e performance', 389.99, 8, 'CPU', 'https://via.placeholder.com/300'),
      ('MSI B650 Tomahawk', 'Scheda madre AM5 affidabile e completa', 239.99, 6, 'Scheda Madre', 'https://via.placeholder.com/300')
  `);

  console.log('Seed prodotti completato');
}

module.exports = {
  seedProdottiIfEmpty,
};
