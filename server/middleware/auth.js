const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function verifyToken(req, res, next) {
  try {
    const [scheme, token] = (req.headers.authorization || '').split(' ');
    if (scheme?.toLowerCase() !== 'bearer') return res.status(401).json({ success: false, message: 'Sign in to continue.' });
    if (!token) return res.status(401).json({ success: false, message: 'Sign in to continue.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: 'This account is unavailable.' });
    req.user = user;
    next();
  } catch (error) { next(error); }
}
function isAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ success: false, message: 'Administrator access required.' });
  next();
}
module.exports = { verifyToken, isAdmin };
