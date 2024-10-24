// const jwt = require('jsonwebtoken');
// const JWT_SECRET = 'IamPuneethKumarSunku$$21BCS215';

// module.exports = function (req, res, next) {
//   // Extract token from 'auth-token' header
//   const token = req.header('auth-token');
//   if (!token) {
//     console.log('No auth-token provided');
//     return res.status(401).json({ message: 'Access Denied, no token provided' });
//   }

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, JWT_SECRET);

//     // Ensure the token has a userId
//     if (!decoded.userId) {
//       console.log('Invalid token structure: userId missing');
//       return res.status(401).json({ message: 'Invalid token structure' });
//     }

//     // Attach the userId to the request object
//     req.user = decoded.userId;
//     next();  // Proceed to the next middleware or route handler
//   } catch (error) {
//     console.error('JWT Verification Error:', error.message);
//     return res.status(401).json({ message: 'Invalid Token' });
//   }
// };

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
