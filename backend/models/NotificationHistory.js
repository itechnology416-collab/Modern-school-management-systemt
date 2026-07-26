const mongoose = require('mongoose');

const notificationHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  channel: { type: String, enum: ['sms', 'app', 'whatsapp', 'telegram', 'email'], required: true },
  title: String,
  message: { type: String, required: true },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  recipientCount: Number,
  status: { type: String, enum: ['sent', 'failed', 'pending'], default: 'sent' },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

module.exports = mongoose.model('NotificationHistory', notificationHistorySchema);
