const jwt = require('jsonwebtoken');
const JWT_SECRET = 'IamPuneethKumarSunku$$21BCS215';

module.exports = function(req, res, next) {
  const token = req.header('auth-token');
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};
