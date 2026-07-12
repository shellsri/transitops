const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

const stripPassword = (user) => {
  const { password, ...userData } = user.toJSON();
  return userData;
};

// POST /auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'A user with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'dispatcher',
    });

    const token = generateToken(user);
    return res.status(201).json({ user: stripPassword(user), token });
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ message: 'Failed to register user', error: err.message });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    return res.status(200).json({ user: stripPassword(user), token });
  } catch (err) {
    console.error('Error logging in:', err);
    return res.status(500).json({ message: 'Failed to log in', error: err.message });
  }
};

// GET /auth/me  (protected by authMiddleware)
exports.me = async (req, res) => {
  return res.status(200).json({ user: req.user });
};
