const router = require('express').Router();
const Notice = require('../models/Notice');
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/auth');
router.get('/', verifyToken, isAdmin, async (req, res, next) => { try {
  const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [totalNotices, totalUsers, postedThisWeek, highPriority, recent] = await Promise.all([
    Notice.countDocuments(), User.countDocuments(), Notice.countDocuments({ createdAt: { $gte: week } }), Notice.countDocuments({ priority: 'High' }),
    Notice.find().populate('postedBy', 'name').sort({ createdAt: -1 }).limit(5)
  ]);
  res.json({ success: true, data: { totalNotices, totalUsers, postedThisWeek, highPriority, recent } });
} catch (e) { next(e); } });
module.exports = router;
