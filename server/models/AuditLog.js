const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  entity: { type: String, required: true },
  recordId: { type: mongoose.Schema.Types.ObjectId, default: null },
  details: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});
schema.index({ createdAt: -1 });
module.exports = mongoose.model('AuditLog', schema);
