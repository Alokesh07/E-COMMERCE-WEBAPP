const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'shopx_secret_key_2024';

// Middleware to verify JWT token and attach fresh user to req.user
exports.verifyToken = async (req, res, next) => {
  try {
    // Support Authorization header, cookie token, or query token (for convenience)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : (req.cookies && req.cookies.token) || req.query.token;

    if (!token) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Fetch fresh user from DB (exclude password). Support legacy 'admin' token
    let user = null;
    if (decoded.userId && decoded.userId !== 'admin') {
      user = await User.findById(decoded.userId).select('-password');
    }

    if (!user) {
      // allow tokens with userId 'admin' or tokens that include role=admin
      if (decoded.userId === 'admin' || decoded.role === 'admin') {
        req.user = {
          userId: decoded.userId || 'admin',
          email: decoded.email || 'admin@local',
          role: 'admin',
          profile: null
        };
        return next();
      }
      return res.status(401).json({ message: 'User not found for provided token' });
    }

    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      profile: user
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admins only.' });
};

// Middleware to check if user is authenticated (including admin)
exports.isAuthenticated = (req, res, next) => {
  if (req.user) return next();
  return res.status(401).json({ message: 'Authentication required' });
};
