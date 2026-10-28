const router = require('express').Router();
const mongoose = require('mongoose');
const { verifyToken } = require('../middleware/auth');
const Notification = require('../models/Notification');

router.use(verifyToken);
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const [data, total, unread] = await Promise.all([
      Notification.find({ recipient: req.user._id }).populate('notice', 'title').populate('event', 'title').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Notification.countDocuments({ recipient: req.user._id }),
      Notification.countDocuments({ recipient: req.user._id, readAt: null })
    ]);
    res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) }, unread });
  } catch (error) { next(error); }
});
router.post('/read-all', async (req, res, next) => {
  try { await Notification.updateMany({ recipient: req.user._id, readAt: null }, { $set: { readAt: new Date() } }); res.json({ success: true, message: 'Notifications marked as read.' }); }
  catch (error) { next(error); }
});
router.patch('/:id/read', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ success: false, message: 'Notification not found.' });
    const notification = await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { $set: { readAt: new Date() } }, { new: true });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });
    res.json({ success: true, data: notification });
  } catch (error) { next(error); }
});
module.exports = router;
