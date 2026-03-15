const jwt = require('jsonwebtoken');

const protectedRoute = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};

module.exports = {
  protectedRoute,
};

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJjaGljazc4IiwiaWF0IjoxNzczNTk2MTA5LCJleHAiOjE3NzM1OTk3MDl9.b63WhQ9uHXou-Hga4dAclx2jnWnDSajCkdi0nKfCpEk