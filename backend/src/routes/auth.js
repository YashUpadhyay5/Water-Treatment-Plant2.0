import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const genToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('companyName').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, password, companyName } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, companyName });
    const token = genToken(user._id);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, companyName: user.companyName, role: user.role }, token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid email or password' });
    const token = genToken(user._id);
    res.json({ user: { id: user._id, name: user.name, email: user.email, companyName: user.companyName, role: user.role }, token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
