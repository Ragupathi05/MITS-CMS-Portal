const router     = require('express').Router();
const Submission = require('../models/Submission');
const Profile    = require('../models/Profile');
const Faculty    = require('../models/Faculty');
const Event      = require('../models/Event');
const Trending   = require('../models/Trending');

// GET all submissions (optionally filter by department or userId)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    if (req.query.userId)     filter.userId     = req.query.userId;
    const subs = await Submission.find(filter).sort({ createdAt: -1 });
    res.json(subs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET single submission
router.get('/:id', async (req, res) => {
  try {
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Not found' });
    res.json(sub);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST create submission
router.post('/', async (req, res) => {
  try {
    const now = new Date().toISOString().slice(0, 10);

    // Always resolve department from the Faculty record — never trust client-sent value
    let department = req.body.department;
    if (req.body.userId) {
      const faculty = await Faculty.findById(req.body.userId).lean();
      if (faculty?.department) department = faculty.department;
    }

    const sub = await Submission.create({
      ...req.body,
      department,
      date: now,
      submittedDate: now,
      status: req.body.status || 'Pending',
    });
    res.status(201).json(sub);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PATCH — approve or reject a submission
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, comment, reviewedBy } = req.body;
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Not found' });

    // Guard: only Pending can be Approved/Rejected
    if ((status === 'Approved' || status === 'Rejected') && sub.status !== 'Pending') {
      return res.status(400).json({ error: 'Only Pending submissions can be approved or rejected' });
    }

    const now = new Date().toISOString().slice(0, 10);
    sub.status     = status;
    sub.reviewedBy = reviewedBy || sub.reviewedBy;
    sub.reviewDate = now;
    if (comment) sub.comments.push(comment);

    // On Approval — apply side effects
    if (status === 'Approved') {
      // Apply basic info update to Faculty document
      if (sub.pendingBasicInfo && sub.userId) {
        const { avatar, ...basicFields } = sub.pendingBasicInfo;
        const updateData = { ...basicFields };
        if (avatar) updateData.avatar = avatar;
        await Faculty.findByIdAndUpdate(sub.userId, updateData);
      }

      // Apply profile sections update
      if (sub.updatedProfile && sub.userId) {
        await Profile.findOneAndUpdate(
          { facultyId: sub.userId },
          { ...sub.updatedProfile, facultyId: sub.userId, status: 'Approved' },
          { upsert: true, new: true }
        );
      }

      // Apply content data (Event / MoU / News)
      if (sub.contentData) {
        const d = sub.contentData;
        if (sub.type === 'Trending') {
          if (d._id) {
            await Trending.findByIdAndUpdate(d._id, { ...d, status: 'Published' });
          } else {
            await Trending.create({ ...d, status: 'Published' });
          }
        } else if (['Event', 'MoU', 'News'].includes(sub.type)) {
          if (d._id) {
            await Event.findByIdAndUpdate(d._id, { ...d, status: 'Approved' });
          } else {
            await Event.create({ ...d, status: 'Approved' });
          }
        }
      }
    }

    // On Rejection — reset profile status to Draft
    if (status === 'Rejected' && sub.type === 'Profile' && sub.userId) {
      await Profile.findOneAndUpdate({ facultyId: sub.userId }, { status: 'Draft' });
    }

    await sub.save();
    // Return a lean version without the large base64 fields to keep response small
    const result = sub.toObject();
    if (result.pendingBasicInfo?.avatar) result.pendingBasicInfo = { ...result.pendingBasicInfo, avatar: null };
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PATCH — mark submission as superseded
router.patch('/:id/supersede', async (req, res) => {
  try {
    const sub = await Submission.findByIdAndUpdate(
      req.params.id,
      { superseded: true },
      { new: true }
    );
    res.json(sub);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE submission
router.delete('/:id', async (req, res) => {
  try {
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
