const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userEmail: String,
  userRole: String,
  action: { type: String, required: true }, // 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'RESET_PASSWORD'
  resource: String, // 'User', 'Fee', 'Student', 'Exam', etc.
  resourceId: mongoose.Schema.Types.ObjectId,
  details: mongoose.Schema.Types.Mixed, // changed fields, old/new values
  ip: String,
  userAgent: String,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  status: { type: String, enum: ['success', 'failure'], default: 'success' },
}, { timestamps: true });

activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ schoolId: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
