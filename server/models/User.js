const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  isActive: { type: Boolean, default: true },
  department: { type: String, trim: true, default: '' },
  academicYear: { type: String, trim: true, default: '' }
}, { timestamps: { createdAt: true, updatedAt: false } });
module.exports = mongoose.model('User', userSchema);
