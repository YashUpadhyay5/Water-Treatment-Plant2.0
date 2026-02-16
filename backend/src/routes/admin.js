import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import User from '../models/User.js';
import WtpDesign from '../models/WtpDesign.js';

const router = Router();
router.use(protect, adminOnly);

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/designs', async (req, res) => {
  try {
    const designs = await WtpDesign.find().populate('userId', 'name email companyName').sort({ updatedAt: -1 });
    res.json(designs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const [userCount, designCount, designsByLayout, recentDesigns] = await Promise.all([
      User.countDocuments(),
      WtpDesign.countDocuments(),
      WtpDesign.aggregate([{ $group: { _id: '$layoutType', count: { $sum: 1 } } }]),
      WtpDesign.find().populate('userId', 'name email').sort({ createdAt: -1 }).limit(10).lean(),
    ]);
    res.json({ userCount, designCount, designsByLayout, recentDesigns });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ message: 'Cannot delete yourself' });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await WtpDesign.deleteMany({ userId: user._id });
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/designs/:id', async (req, res) => {
  try {
    const design = await WtpDesign.findByIdAndDelete(req.params.id);
    if (!design) return res.status(404).json({ message: 'Design not found' });
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
