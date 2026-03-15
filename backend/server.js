const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { productsRouter } = require('./routes/products');
const { usersRouter } = require('./routes/users');
const { loginRouter } = require('./routes/login');
// const db = require("./db")

require('dotenv').config();
const app = express();
const port = 8080;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());

//health check
app.get('/api', (req, res) => {
  res.json("server running")
})

// routes
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

try {
  app.listen(port, () => {
    console.log(`Server Express + MySQL su http://localhost:${port}`);
  });
} catch (error) {
  console.error('Errore inizializzazione server:', error.message);
  process.exit(1);
}


