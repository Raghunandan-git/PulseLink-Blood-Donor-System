//models/Donation.js

const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },

  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodRequest'
  },

  hospitalName: String,
  city: String,

  donatedAt: {
    type: Date,
    default: Date.now
  }
});

donationSchema.index({ request: 1 }, { unique: true });

module.exports = mongoose.model('Donation', donationSchema);
