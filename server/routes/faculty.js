const router  = require('express').Router();
const Faculty = require('../models/Faculty');

// GET all faculty
router.get('/', async (req, res) => {
  try {
    const faculty = await Faculty.find().sort({ createdAt: 1 });
    res.json(faculty);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET single faculty
router.get('/:id', async (req, res) => {
  try {
    const f = await Faculty.findById(req.params.id);
    if (!f) return res.status(404).json({ error: 'Not found' });
    res.json(f);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST create faculty
router.post('/', async (req, res) => {
  try {
    const f = await Faculty.create(req.body);
    res.status(201).json(f);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT update faculty
router.put('/:id', async (req, res) => {
  try {
    const f = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!f) return res.status(404).json({ error: 'Not found' });
    res.json(f);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE faculty
router.delete('/:id', async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
