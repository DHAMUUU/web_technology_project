const router = require('express').Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const { verifyToken, isAdmin } = require('../middleware/auth');
const CampusEvent = require('../models/CampusEvent');
const { audit, notifyEvent } = require('../utils/records');
const { groupAudienceConditions } = require('../utils/audience');
router.use(verifyToken);
function visible(user) {
  if (user.role === 'admin') return {};
  const publicEvent = { $and: [
    { $or: [{ departments: { $size: 0 } }, { departments: { $exists: false } }] },
    { $or: [{ academicYears: { $size: 0 } }, { academicYears: { $exists: false } }] }
  ] };
  return { $or: [publicEvent, groupAudienceConditions(user)] };
}
const rules = [body('title').trim().isLength({ min: 1, max: 140 }), body('description').optional().isString().isLength({ max: 5000 }), body('kind').optional().isIn(['Exam','Assignment','Workshop','College event','Registration','Holiday','Other']), body('startAt').isISO8601(), body('endAt').optional({ nullable: true }).isISO8601(), body('notice').optional({ nullable: true }).isMongoId(), body('departments').optional().isArray({ max: 30 }), body('departments.*').optional().isString().trim().isLength({ max: 80 }), body('academicYears').optional().isArray({ max: 20 }), body('academicYears.*').optional().isString().trim().isLength({ max: 40 })];
function check(req) { const errors = validationResult(req); if (!errors.isEmpty()) { const error = new Error(errors.array()[0].msg); error.status = 400; throw error; } }
router.get('/', async (req, res, next) => {
  try {
    const from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 30 * 86400000);
    const to = req.query.to ? new Date(req.query.to) : new Date(Date.now() + 365 * 86400000);
    if (Number.isNaN(from.valueOf()) || Number.isNaN(to.valueOf()) || to < from) return res.status(400).json({ success: false, message: 'Invalid event date range.' });
    const filter = { startAt: { $gte: from, $lte: to }, ...visible(req.user) };
    const events = await CampusEvent.find(filter).populate('notice', 'title').populate('createdBy', 'name').sort({ startAt: 1 }).limit(500);
    res.json({ success: true, data: events });
  } catch (error) { next(error); }
});
router.post('/', isAdmin, rules, async (req, res, next) => {
  try {
    check(req);
    if (req.body.endAt && new Date(req.body.endAt) < new Date(req.body.startAt)) return res.status(400).json({ success: false, message: 'End time must be after the start time.' });
    const fields = Object.fromEntries(['title','description','kind','startAt','endAt','notice','departments','academicYears'].filter(key => Object.hasOwn(req.body, key)).map(key => [key, req.body[key]]));
    const event = await CampusEvent.create({ ...fields, createdBy: req.user._id });
    await audit(req.user, 'event.created', 'event', event._id, event.title);
    try { await notifyEvent(event); } catch (error) { console.error('Event notification failed:', error.message); }
    res.status(201).json({ success: true, data: event });
  } catch (error) { next(error); }
});
router.put('/:id', isAdmin, rules, async (req, res, next) => {
  try {
    check(req);
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ success: false, message: 'Event not found.' });
    if (req.body.endAt && new Date(req.body.endAt) < new Date(req.body.startAt)) return res.status(400).json({ success: false, message: 'End time must be after the start time.' });
    const fields = Object.fromEntries(['title','description','kind','startAt','endAt','notice','departments','academicYears'].filter(key => Object.hasOwn(req.body, key)).map(key => [key, req.body[key]]));
    const event = await CampusEvent.findByIdAndUpdate(req.params.id, fields, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    await audit(req.user, 'event.updated', 'event', event._id, event.title);
    res.json({ success: true, data: event });
  } catch (error) { next(error); }
});
router.delete('/:id', isAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ success: false, message: 'Event not found.' });
    const event = await CampusEvent.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    await audit(req.user, 'event.deleted', 'event', event._id, event.title);
    res.json({ success: true, message: 'Event deleted.' });
  } catch (error) { next(error); }
});
module.exports = router;
