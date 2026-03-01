//models/Donor.js
const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  fullName: String,
  bloodGroup: String,
  phone: String,
  dob: Date,
  weight: Number,
  address: String,
  location: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [lng, lat]
    required: true
  }
},
  isEligible: {
    type: Boolean,
    default: true
  },

  isAvailable: {
    type: Boolean,
    default: true   // 👈 IMPORTANT
  },

  lastDonationDate: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});


donorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Donor', donorSchema);
