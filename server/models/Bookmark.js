const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  notice: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});
schema.index({ notice: 1, user: 1 }, { unique: true });
schema.index({ user: 1, createdAt: -1 });
module.exports = mongoose.model('Bookmark', schema);
