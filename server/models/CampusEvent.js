const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  description: { type: String, trim: true, default: '' },
  kind: { type: String, enum: ['Exam', 'Assignment', 'Workshop', 'College event', 'Registration', 'Holiday', 'Other'], default: 'Other' },
  startAt: { type: Date, required: true },
  endAt: { type: Date, default: null },
  notice: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', default: null },
  isDemo: { type: Boolean, default: false, index: true },
  demoKey: { type: String, trim: true, unique: true, sparse: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  departments: [{ type: String, trim: true }],
  academicYears: [{ type: String, trim: true }]
}, { timestamps: true });
schema.index({ startAt: 1 });
module.exports = mongoose.model('CampusEvent', schema);
