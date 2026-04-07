const router  = require('express').Router();
const Profile = require('../models/Profile');

// GET profile by facultyId
router.get('/:facultyId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ facultyId: req.params.facultyId });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST — create or fully replace profile for a faculty member
router.post('/:facultyId', async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { facultyId: req.params.facultyId },
      { ...req.body, facultyId: req.params.facultyId },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json(profile);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PATCH — update only specific sections (partial update)
router.patch('/:facultyId', async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { facultyId: req.params.facultyId },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(profile);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PATCH — update profile status only
router.patch('/:facultyId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { facultyId: req.params.facultyId },
      { $set: { status } },
      { new: true }
    );
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
