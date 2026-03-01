// controllers/adminController.js
const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');

exports.confirmDonation = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await BloodRequest
      .findById(requestId)
      .populate('donor');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // 🔒 CRITICAL GUARD
    if (request.status === 'Fulfilled') {
      return res.status(400).json({
        message: 'Donation already confirmed for this request'
      });
    }

    if (request.status !== 'Accepted') {
      return res.status(400).json({
        message: 'Request must be accepted before confirmation'
      });
    }

    const donor = request.donor;

    const donation = await Donation.create({
      donor: donor._id,
      request: request._id,
      hospitalName: request.hospitalName,
      city: request.city
    });

    donor.lastDonationDate = donation.donatedAt;
    donor.isAvailable = false;
    await donor.save();

    request.status = 'Fulfilled';
    await request.save();

    res.json({
      message: 'Donation confirmed successfully',
      donation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

// GET ACCEPTED REQUESTS (WAITING FOR CONFIRMATION)
exports.getAcceptedRequests = async (req, res) => {
  try {
    const requests = await BloodRequest
      .find({ status: 'Accepted' }) // 🔥 ONLY donor-accepted
      .populate('donor', 'fullName bloodGroup phone')
      .populate('requester', 'fullName phone email') // ✅ CORRECT FIELD
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error('Admin getAcceptedRequests error:', err);
    res.status(500).json({ message: 'Failed to fetch verification queue' });
  }
};


// GET DASHBOARD STATS
exports.getAdminStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalDonors = await Donor.countDocuments();
  const totalRequests = await BloodRequest.countDocuments();
  const totalDonations = await Donation.countDocuments();

  res.json({
    totalUsers,
    totalDonors,
    totalRequests,
    totalDonations
  });
};

exports.getAllDonations = async (req, res) => {
  const donations = await Donation
    .find()
    .populate('donor')
    .populate('request');

  res.json(donations);
};


exports.getAllRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find()
      .populate('requester', 'fullName email phone')
      .populate('donor', 'bloodGroup')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error('Admin getAllRequests error:', err);
    res.status(500).json({ message: 'Failed to fetch blood requests' });
  }
};

exports.getSOSRequests = async (req, res) => {
  const requests = await BloodRequest.find({ isSOS: true })
    .populate('requester', 'fullName phone')
    .populate('donor', 'fullName phone')
    .sort({ createdAt: -1 });

  res.json(requests);
};
