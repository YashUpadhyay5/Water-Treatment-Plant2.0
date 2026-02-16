import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();
router.use(protect);

router.get('/profile', async (req, res) => {
  res.json({ user: req.user });
});

router.patch('/profile', [
  body('name').optional().trim().notEmpty(),
  body('companyName').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const user = await User.findById(req.user._id);
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.companyName !== undefined) user.companyName = req.body.companyName;
    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email, companyName: user.companyName, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
