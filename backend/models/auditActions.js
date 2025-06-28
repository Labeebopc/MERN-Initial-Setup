const mongoose = require('mongoose');

const auditActionSchema = new mongoose.Schema({
  ts: { 
    type: Date, default: Date.now 
  },

  userId: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null 
  },

  filter: { type: Object }
});

module.exports = mongoose.model('AuditAction', auditActionSchema);
