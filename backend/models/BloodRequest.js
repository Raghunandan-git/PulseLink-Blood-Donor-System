//models/BloodRequest.js
const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  bloodGroup: {
    type: String,
    required: true,
    uppercase: true
  },

  unitsRequired: {
    type: Number,
    required: true,
    min: 1
  },

  hospitalName: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  contactNumber: {
    type: String,
    required: true
  },

  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },

  status: {
  type: String,
  enum: ['Open', 'Accepted', 'Fulfilled', 'Cancelled'],
  default: 'Open'
},

  isSOS: {
  type: Boolean,
  default: false
},

  acceptedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Donor'
},

donor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Donor',
  default: null
},
location: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
}


}, { timestamps: true });
bloodRequestSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
