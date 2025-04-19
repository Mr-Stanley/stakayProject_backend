const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['money', 'food'],
    required: [true, 'Donation type is required'],
  },
  amount: {
    type: Number,
    required: function () { return this.type === 'money'; },
    min: [500, 'Amount should not be less than 500'],
  },
  foodItems: {
    type: [{ name: String, quantity: String }],
    required: function () { return this.type === 'food'; },
  },
  charity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charity',
    default: null, 
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'delivered', 'completed'],
    default: function () { return this.type === 'money' ? 'completed' : 'pending'; },
  },
  deliveryAddress: {
    type: String,
    default: null, 
  },
  paymentWallet: {
    type: String,
    default: null, 
  },
  paymentSessionId: {
    type: String,
    default: null, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Donation', donationSchema);