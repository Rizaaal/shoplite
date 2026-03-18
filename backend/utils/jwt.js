const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id_cliente ?? user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.SECRET_KEY,
    { expiresIn: '1h' },
  );
};

module.exports = {
  generateToken,
};
