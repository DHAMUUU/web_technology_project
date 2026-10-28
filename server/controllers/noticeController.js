const Notice = require('../models/Notice');
const { validationResult } = require('express-validator');
function validate(req) { const errors = validationResult(req); if (!errors.isEmpty()) { const e = new Error(errors.array()[0].msg); e.status = 400; throw e; } }
async function list(req, res, next) { try {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };
  // Public board hides notices after their expiry date; admins can still see all notices.
  if (req.user.role !== 'admin') filter.$or = [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }];
  const notices = await Notice.find(filter).populate('postedBy', 'name').sort({ isPinned: -1, createdAt: -1 });
  res.json({ success: true, data: notices });
} catch (e) { next(e); } }
async function get(req, res, next) { try { const notice = await Notice.findById(req.params.id).populate('postedBy', 'name'); if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' }); if (req.user.role !== 'admin' && notice.expiryDate && notice.expiryDate < new Date()) return res.status(404).json({ success: false, message: 'Notice has expired.' }); res.json({ success: true, data: notice }); } catch (e) { next(e); } }
async function create(req, res, next) { try { validate(req); const notice = await Notice.create({ ...req.body, postedBy: req.user._id }); res.status(201).json({ success: true, message: 'Notice published', data: notice }); } catch (e) { next(e); } }
async function update(req, res, next) { try { validate(req); const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' }); res.json({ success: true, message: 'Notice updated', data: notice }); } catch (e) { next(e); } }
async function remove(req, res, next) { try { const notice = await Notice.findByIdAndDelete(req.params.id); if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' }); res.json({ success: true, message: 'Notice deleted', data: notice }); } catch (e) { next(e); } }
module.exports = { list, get, create, update, remove };
