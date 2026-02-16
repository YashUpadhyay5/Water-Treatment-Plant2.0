import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import WtpDesign from '../models/WtpDesign.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const list = await WtpDesign.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('flowRate').isFloat({ min: 0.1 }).withMessage('Valid flow rate required'),
  body('numberOfTanks').isInt({ min: 1, max: 20 }).withMessage('Tanks 1-20'),
  body('pipeDiameter').isFloat({ min: 0.1 }).withMessage('Valid pipe diameter required'),
  body('layoutType').optional().isIn(['compact', 'industrial']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, flowRate, numberOfTanks, pipeDiameter, layoutType } = req.body;
    const design = await WtpDesign.create({
      userId: req.user._id,
      name,
      flowRate: Number(flowRate),
      numberOfTanks: Number(numberOfTanks),
      pipeDiameter: Number(pipeDiameter),
      layoutType: layoutType || 'compact',
      metadata: req.body.metadata || {},
    });
    res.status(201).json(design);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const design = await WtpDesign.findOne({ _id: req.params.id, userId: req.user._id });
    if (!design) return res.status(404).json({ message: 'Design not found' });
    res.json(design);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch('/:id', [
  body('name').optional().trim().notEmpty(),
  body('flowRate').optional().isFloat({ min: 0.1 }),
  body('numberOfTanks').optional().isInt({ min: 1, max: 20 }),
  body('pipeDiameter').optional().isFloat({ min: 0.1 }),
  body('layoutType').optional().isIn(['compact', 'industrial']),
], async (req, res) => {
  try {
    const design = await WtpDesign.findOne({ _id: req.params.id, userId: req.user._id });
    if (!design) return res.status(404).json({ message: 'Design not found' });
    const updates = ['name', 'flowRate', 'numberOfTanks', 'pipeDiameter', 'layoutType', 'metadata'].filter(k => req.body[k] !== undefined);
    updates.forEach(k => { design[k] = req.body[k]; });
    await design.save();
    res.json(design);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const design = await WtpDesign.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!design) return res.status(404).json({ message: 'Design not found' });
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
