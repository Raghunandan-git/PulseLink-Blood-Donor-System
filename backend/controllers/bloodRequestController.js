//controllers/bloodRequestController.js
const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const Donor = require('../models/Donor');
const Notification = require('../models/Notification');


/* ================================
   CREATE BLOOD REQUEST
================================ */
exports.createRequest = async (req, res) => {
  try {
    const activeRequest = await BloodRequest.findOne({
      requester: req.user.id,
      status: { $in: ['Open', 'Accepted'] }
    });
    if (activeRequest) {
      return res.status(400).json({
        message: 'You already have an active blood request'
      });
    }
    const newRequest = await BloodRequest.create({
  requester: req.user.id,
  bloodGroup: req.body.bloodGroup,
  unitsRequired: req.body.unitsRequired,
  hospitalName: req.body.hospitalName,
  city: req.body.city,
  contactNumber: req.body.contactNumber,
  urgency: req.body.urgency,

  location: {
    type: "Point",
    coordinates: [req.body.longitude, req.body.latitude]
  }
});
    // 🔔 Notify matching donors
// After newRequest is created

let MAX_DISTANCE = 10000; // default 10km

if (req.body.urgency === "High") {
  MAX_DISTANCE = 20000;
}
if (!req.body.latitude || !req.body.longitude) {
  return res.status(400).json({
    message: "Location is required"
  });
}
console.log("Request coordinates:", newRequest.location.coordinates);
console.log("MAX_DISTANCE (meters):", MAX_DISTANCE);
const nearbyDonors = await Donor.find({
  bloodGroup: newRequest.bloodGroup,
  isAvailable: true,
  isEligible: true,
  location: {
    $near: {
      $geometry: newRequest.location,
      $maxDistance: MAX_DISTANCE
    }
  }
});

console.log("Nearby donors found:", nearbyDonors.length);

// Send notification only to nearby donors
for (const donor of nearbyDonors) {
  await Notification.create({
    user: donor.userId,
    title: "New Blood Request Nearby",
    message: `${newRequest.bloodGroup} blood needed at ${newRequest.hospitalName}`
  });
}
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================================
   GET OPEN REQUESTS (DONORS)
================================ */
exports.getOpenRequests = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });

    if (!donor) {
      return res.status(404).json({ message: "Donor profile not found" });
    }
    if (!donor.isAvailable || !donor.isEligible) {
  return res.json([]);
}

    if (!donor.location || !donor.location.coordinates) {
      return res.status(400).json({ message: "Donor location not set" });
    }

    const MAX_DISTANCE = 10000; // 5km radius

    const nearbyRequests = await BloodRequest.find({
      status: "Open",
      bloodGroup: donor.bloodGroup,
      location: {
        $near: {
          $geometry: donor.location,
          $maxDistance: MAX_DISTANCE
        }
      }
    })
      .populate("requester", "fullName phone")
      .sort({ createdAt: -1 });

    res.json(nearbyRequests);

  } catch (error) {
    console.error("getOpenRequests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET MY REQUESTS (SEEKER)
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await BloodRequest
      .find({ requester: req.user.id })   // 🔑 only this seeker
      .populate('donor', 'fullName bloodGroup phone')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('getMyRequests error:', error);
    res.status(500).json({ message: 'Failed to fetch your requests' });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findOne({
      _id: req.params.id,
      requester: req.user.id
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'Open') {
      return res.status(400).json({
        message: 'Only open requests can be cancelled'
      });
    }

    request.status = 'Cancelled';
    await request.save();

    res.json({ message: 'Request cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* ================================
   CREATE SOS BLOOD REQUEST
================================ */
exports.createSOSRequest = async (req, res) => {
  try {
    // 🔒 Prevent multiple active requests
    const activeRequest = await BloodRequest.findOne({
      requester: req.user.id,
      status: { $in: ['Open', 'Accepted'] }
    });

    if (activeRequest) {
      return res.status(400).json({
        message: 'You already have an active request'
      });
    }

    // 🛑 Validate location
    if (!req.body.latitude || !req.body.longitude) {
      return res.status(400).json({
        message: "Location is required for SOS request"
      });
    }

    // ✅ Create SOS request WITH GEO LOCATION
    const sosRequest = await BloodRequest.create({
      requester: req.user.id,
      bloodGroup: req.body.bloodGroup,
      unitsRequired: req.body.unitsRequired,
      hospitalName: req.body.hospitalName,
      city: req.body.city,
      contactNumber: 'EMAIL_ONLY',
      urgency: 'High',
      isSOS: true,
      location: {
        type: "Point",
        coordinates: [req.body.longitude, req.body.latitude]
      }
    });

    // 🚨 50KM radius for SOS
    const MAX_DISTANCE = 75000; // 75km in meters
    console.log("SOS Request coordinates:", sosRequest.location.coordinates);
console.log("SOS MAX_DISTANCE (meters):", MAX_DISTANCE);

    // 🔍 Find nearby matching donors
    const donors = await Donor.find({
      bloodGroup: sosRequest.bloodGroup,
      isAvailable: true,
      isEligible: true,
      location: {
        $near: {
          $geometry: sosRequest.location,
          $maxDistance: MAX_DISTANCE
        }
      }
    }).populate('userId');

    console.log('🚨 SOS NEARBY DONORS FOUND:', donors.length);

    let emailFailures = 0;

    // 🔔 Send notification + email
    for (const donor of donors) {

      // In-app notification
      await Notification.create({
        user: donor.userId._id,
        title: "🚨 SOS Blood Request Nearby",
        message: `URGENT ${sosRequest.bloodGroup} needed at ${sosRequest.hospitalName} (${sosRequest.city})`
      });

      if (!donor.userId?.email) continue;

      try {
        await sendEmail(
          donor.userId.email,
          `🚨 URGENT: ${sosRequest.bloodGroup} Blood Needed at ${sosRequest.hospitalName}`,
          `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f6f8; padding: 20px; border-radius: 8px;">
            <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e0e0e0;">
              
              <div style="background-color: #d32f2f; color: #ffffff; padding: 20px; text-align: center;">
                <h2 style="margin: 0; font-size: 22px; letter-spacing: 1px;">🚨 EMERGENCY SOS ALERT</h2>
              </div>
              
              <div style="padding: 30px;">
                <p style="font-size: 16px; color: #333333; margin-top: 0;">Hello <b>${donor.userId.fullName || 'Hero'}</b>,</p>
                <p style="font-size: 16px; color: #555555; line-height: 1.5;">A critical blood request has just been raised near your location. Your immediate help is needed and could save a life.</p>
                
                <div style="background-color: #fff8f8; border-left: 4px solid #d32f2f; padding: 15px; margin: 25px 0; border-radius: 0 4px 4px 0;">
                  <p style="margin: 5px 0; font-size: 16px; color: #333333;"><b>Blood Group:</b> <span style="color: #d32f2f; font-weight: bold; font-size: 18px;">${sosRequest.bloodGroup}</span></p>
                  <p style="margin: 5px 0; font-size: 16px; color: #333333;"><b>Hospital:</b> ${sosRequest.hospitalName}</p>
                  <p style="margin: 5px 0; font-size: 16px; color: #333333;"><b>City:</b> ${sosRequest.city}</p>
                </div>
                
                <div style="text-align: center; margin: 35px 0 15px;">
                  <a href="${process.env.CLIENT_URL}/requests" style="background-color: #d32f2f; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px;">
                    Respond Now
                  </a>
                </div>
              </div>
              
              <div style="background-color: #fafafa; padding: 15px; text-align: center; border-top: 1px solid #eeeeee;">
                <p style="margin: 0; font-size: 13px; color: #777777;">Thank you for being a lifesaver ❤️</p>
                <p style="margin: 8px 0 0; font-size: 11px; color: #aaaaaa;">If you are unable to donate at this time, please ignore this email.</p>
              </div>
              
            </div>
          </div>
          `
        );
      } catch (err) {
        emailFailures++;
        console.error('❌ Email failed for:', donor.userId.email);
      }
    }

    res.status(201).json({
      message: 'SOS blood request created (50km radius)',
      request: sosRequest,
      donorsFound: donors.length,
      emailFailures
    });

  } catch (error) {
    console.error('SOS ERROR:', error);
    res.status(500).json({
      message: 'Failed to create SOS request'
    });
  }
};