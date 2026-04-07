const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Faculty = require('../models/Faculty');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const faculty = await Faculty.findOne({ email: email.toLowerCase().trim() });
    if (!faculty || !faculty.passwordHash)
      return res.status(401).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, faculty.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    res.json({
      id: faculty._id,
      name: faculty.name,
      email: faculty.email,
      role: faculty.role,
      department: faculty.department,
      designation: faculty.designation,
      avatar: faculty.avatar,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
