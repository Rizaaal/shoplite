const express = require('express');
const router = express.Router();
const { mockUsers } = require('./users');
const { protectedRoute } = require('../middlewares/protectedRoute');
const jwt = require('jsonwebtoken');

//login
router.post('/', async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = mockUsers.find(user => user.email === email)
    const unauthorizedError = { error: "client error: unauthorized"};

    // if user not found
    if (!user) res.status(401).json(unauthorizedError)

    //check password, else return error
    if (password === user.password) {

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

      res.json({ token })
    } else {
      res.status(401).json(unauthorizedError)
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error: couldn't get user"})
  }
})

module.exports = {
  loginRouter: router,
};

