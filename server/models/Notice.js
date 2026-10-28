const mongoose = require('mongoose');
const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Academic', 'Exam', 'Event', 'Holiday', 'General'], default: 'General' },
  priority: { type: String, enum: ['Low', 'Normal', 'High'], default: 'Normal' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiryDate: { type: Date, default: null },
  isPinned: { type: Boolean, default: false },
  status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published', index: true },
  audience: { type: String, enum: ['campus', 'targeted'], default: 'campus' },
  departments: [{ type: String, trim: true }],
  academicYears: [{ type: String, trim: true }]
}, { timestamps: true });
noticeSchema.index({ status: 1, isPinned: -1, createdAt: -1 });
noticeSchema.index({ expiryDate: 1 });
module.exports = mongoose.model('Notice', noticeSchema);
