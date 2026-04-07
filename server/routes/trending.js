const router   = require('express').Router();
const Trending = require('../models/Trending');

// GET all trending (filter by department)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    if (req.query.status)     filter.status     = req.query.status;
    const items = await Trending.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const item = await Trending.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const item = await Trending.create({
      ...req.body,
      date: req.body.date || new Date().toISOString().slice(0, 10),
    });
    res.status(201).json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const item = await Trending.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Trending.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
