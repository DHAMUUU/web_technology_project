const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 140 },
  kind: { type: String, enum: ['Assignment', 'Study', 'Exam prep', 'Personal'], default: 'Assignment' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueAt: { type: Date, default: null },
  completedAt: { type: Date, default: null }
}, { timestamps: true });
taskSchema.index({ user: 1, completedAt: 1, dueAt: 1 });
module.exports = mongoose.model('StudentTask', taskSchema);
