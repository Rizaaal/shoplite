const jwt = require('jsonwebtoken');

const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log('AUTH HEADER:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];

    console.log('TOKEN:', token);

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    console.log('DECODED TOKEN:', decoded);

    req.user = decoded;
    return next();
  } catch (error) {
    console.log('OPTIONAL AUTH ERROR:', error.message);
    req.user = null;
    return next();
  }
};

module.exports = {
  optionalAuth,
};
