const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  notice: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', default: null },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'CampusEvent', default: null },
  type: { type: String, enum: ['new_notice', 'urgent', 'deadline', 'event'], default: 'new_notice' },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  readAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});
schema.index({ recipient: 1, createdAt: -1 });
module.exports = mongoose.model('Notification', schema);
