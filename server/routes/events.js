const router = require('express').Router();
const Event  = require('../models/Event');

// GET all events (filter by type and/or department)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.type)       filter.type       = req.query.type;
    if (req.query.department) filter.department = req.query.department;
    if (req.query.status)     filter.status     = req.query.status;
    const events = await Event.find(filter).sort({ createdAt: -1 });
    res.json(events);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ error: 'Not found' });
    res.json(ev);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST create event/MoU/news
router.post('/', async (req, res) => {
  try {
    const ev = await Event.create({
      ...req.body,
      date: req.body.date || new Date().toISOString().slice(0, 10),
    });
    res.status(201).json(ev);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT update event
router.put('/:id', async (req, res) => {
  try {
    const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ev) return res.status(404).json({ error: 'Not found' });
    res.json(ev);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
