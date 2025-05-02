const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  reference: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, if you have a User model
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema); 