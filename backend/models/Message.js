const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  garden: { type: mongoose.Schema.Types.ObjectId, ref: 'Garden', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);