const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * authMiddleware
 * Verifies the Bearer JWT on the Authorization header, loads the
 * corresponding user, and attaches it to req.user.
 *
 * Exported directly as a function (NOT wrapped in an object) so it can be
 * used as `router.use(authMiddleware)` or `router.get('/me', authMiddleware, handler)`
 * without hitting a "[object Object] is not a function" routing error.
 */
module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = user;
    return next();
  } catch (err) {
    console.error('Error in authMiddleware:', err);
    return res.status(500).json({ message: 'Authentication error', error: err.message });
  }
};
