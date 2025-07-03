import mongoose from 'mongoose';

const securityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    required: true
  },
  resource: {
    type: String,
    required: true
  },
  success: {
    type: Boolean,
    required: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for efficient querying
securityLogSchema.index({ userId: 1, createdAt: -1 });
securityLogSchema.index({ action: 1, createdAt: -1 });
securityLogSchema.index({ success: 1, createdAt: -1 });

const SecurityLog = mongoose.model('SecurityLog', securityLogSchema);

export default SecurityLog;