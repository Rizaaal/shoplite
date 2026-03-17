const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const clientiRoutes = require('./routes/clientiRoutes');
const prodottiRoutes = require('./routes/prodottiRoutes');
const ordiniRoutes = require('./routes/ordiniRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const { notFound } = require('./middlewares/notFound');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:4200',
  }),
);

app.use(express.json());

app.get('/api', (req, res) => {
  return res.json('server running');
});

app.use('/api/auth', authRoutes);
app.use('/api/clienti', clientiRoutes);
app.use('/api/prodotti', prodottiRoutes);
app.use('/api/ordini', ordiniRoutes);
app.use('/api/upload', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
