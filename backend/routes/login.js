const express = require('express');
const router = express.Router();
const { mockUsers } = require('./users');

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
      res.json(user)
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

