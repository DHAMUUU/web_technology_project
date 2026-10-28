const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const Notice = require('../models/Notice');
const User = require('../models/User');
const NoticeRead = require('../models/NoticeRead');
const CampusEvent = require('../models/CampusEvent');
router.get('/', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const week = new Date(Date.now() - 7 * 86400000);
    const now = new Date();
    const publicNotice = { $or: [{ status: 'published' }, { status: { $exists: false } }] };
    const [totalNotices,totalUsers,postedThisWeek,highPriority,pinned,expiring,categoryCounts,recent,upcomingEvents,publishedIds,monthly] = await Promise.all([
      Notice.countDocuments(publicNotice), User.countDocuments({ isActive: true }),
      Notice.countDocuments({ ...publicNotice, createdAt: { $gte: week } }),
      Notice.countDocuments({ ...publicNotice, priority: 'High' }),
      Notice.countDocuments({ ...publicNotice, isPinned: true }),
      Notice.countDocuments({ ...publicNotice, expiryDate: { $gte: now, $lte: new Date(Date.now() + 7 * 86400000) } }),
      Notice.aggregate([{ $match: publicNotice }, { $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Notice.find(publicNotice).populate('postedBy', 'name').sort({ createdAt: -1 }).limit(6),
      CampusEvent.find({ startAt: { $gte: now } }).sort({ startAt: 1 }).limit(5),
      Notice.find(publicNotice).select('_id').lean(),
      Notice.aggregate([{ $match: { ...publicNotice, createdAt: { $gte: new Date(Date.now() - 180 * 86400000) } } }, { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }])
    ]);
    const readCount = await NoticeRead.countDocuments({ notice: { $in: publishedIds.map(item => item._id) } });
    res.json({ success: true, data: { totalNotices,totalUsers,postedThisWeek,highPriority,pinned,expiring,categoryCounts,recent,upcomingEvents,readCount,monthly } });
  } catch (error) { next(error); }
});
module.exports = router;
