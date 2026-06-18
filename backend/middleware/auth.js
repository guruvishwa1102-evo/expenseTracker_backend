const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Get token from header
  const authHeader = req.header('Authorization');
  
  // 2. Check if no header at all
  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // 3. Extract the token from the "Bearer <token>" string
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token format invalid' });
  }

  // 4. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 5. Attach the user ID to the request
    req.user = decoded.user || decoded; 
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};