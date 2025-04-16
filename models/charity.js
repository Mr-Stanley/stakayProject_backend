const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Charity name is required'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Charity', charitySchema);