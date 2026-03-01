//controllers/donorController.js

const Donor = require('../models/Donor');
const User = require('../models/User');
const Donation = require('../models/Donation');

const isEligibleToDonate = require('../utils/eligibility');

exports.toggleAvailability = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
// 🔥 SINGLE SOURCE OF TRUTH
const eligible = await isEligibleToDonate(donor);

if (!eligible) {
  return res.status(400).json({
    message: 'Not eligible to donate yet'
  });
}


    donor.isAvailable = !donor.isAvailable;
    await donor.save();

    res.json({
      message: 'Availability updated',
      isAvailable: donor.isAvailable
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



/* =========================================================
   GET DONOR PROFILE
========================================================= */

exports.getDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    if (!donor) {
      return res.status(404).json({ message: 'Profile not completed' });
    }

    const lastDonation = await Donation.findOne({ donor: donor._id })
      .sort({ donatedAt: -1 });

    res.json({
      ...donor.toObject(),
      lastDonationDate: lastDonation ? lastDonation.donatedAt : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* =========================================================
   CREATE OR UPDATE DONOR PROFILE
========================================================= */
exports.createOrUpdateDonor = async (req, res) => {
  try {
    const {
      fullName,
      bloodGroup,
      phone,
      dob,
      weight,
      address,
      latitude,
      longitude
    } = req.body;

    // 🔥 STEP 1: Validate coordinates
    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        message: "Latitude and longitude are required"
      });
    }

    // 🔥 STEP 2: Convert to numbers
    const latNum = Number(latitude);
    const lngNum = Number(longitude);

    if (isNaN(latNum) || isNaN(lngNum)) {
      return res.status(400).json({
        message: "Invalid latitude or longitude"
      });
    }

    const donorData = {
      fullName,
      bloodGroup,
      phone,
      dob,
      weight,
      address,
      userId: req.user.id,

      location: {
        type: "Point",
        coordinates: [lngNum, latNum] // 🔥 CORRECT ORDER
      }
    };

    let donor = await Donor.findOne({ userId: req.user.id });

    if (!donor) {
      donor = await Donor.create(donorData);
    } else {
      Object.assign(donor, donorData);
    }

    const eligible = await isEligibleToDonate(donor);

    donor.isEligible = eligible;
    donor.isAvailable = eligible;

    await donor.save();

    await User.findByIdAndUpdate(req.user.id, {
      isProfileComplete: true
    });

    res.json({
      message: "Donor profile saved successfully",
      donor,
      isEligible: eligible
    });

  } catch (error) {
    console.error("🔥 DONOR SAVE ERROR:", error);
    res.status(500).json({
      message: "Error saving donor profile",
      error: error.message
    });
  }
};

/* =========================================================
   SEARCH DONORS (PUBLIC – FOR SEEKERS)
========================================================= */
exports.searchDonors = async (req, res) => {
  try {
    const { bloodGroup, lat, lng } = req.query;

    if (!bloodGroup || !lat || !lng) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    const donors = await Donor.find({
      bloodGroup: bloodGroup.toUpperCase(),
      isAvailable: true,
      isEligible: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 5000
        }
      }
    });

    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};