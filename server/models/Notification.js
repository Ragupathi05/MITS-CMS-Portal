const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId:  { type: String, required: true },
    message: { type: String, required: true, trim: true },
    type:    { type: String, enum: ['success', 'error', 'warning', 'info'], default: 'info' },
    time:    { type: String, default: 'just now' },
    read:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
