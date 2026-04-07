const router       = require('express').Router();
const Notification = require('../models/Notification');

// GET notifications for a user
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    const notifs = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json(notifs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST create notification
router.post('/', async (req, res) => {
  try {
    const n = await Notification.create(req.body);
    res.status(201).json(n);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PATCH mark one as read
router.patch('/:id/read', async (req, res) => {
  try {
    const n = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(n);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PATCH mark all as read for a user
router.patch('/mark-all-read', async (req, res) => {
  try {
    const { userId } = req.body;
    await Notification.updateMany({ userId, read: false }, { read: true });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE all notifications for a user
router.delete('/clear', async (req, res) => {
  try {
    const { userId } = req.body;
    await Notification.deleteMany({ userId });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
