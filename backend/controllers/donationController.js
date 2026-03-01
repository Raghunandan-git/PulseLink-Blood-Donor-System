// controllers/donationController.js

const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');

/* =========================================================
   GET MY DONATION HISTORY
========================================================= */
exports.getMyDonations = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    const donations = await Donation.find({ donor: donor._id })
      .sort({ donatedAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id }).populate("userId");

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    // 🔥 Find & lock request
    const request = await BloodRequest.findOneAndUpdate(
      {
        _id: req.body.requestId,
        status: "Open"
      },
      {
        status: "Accepted",
        donor: donor._id
      },
      { new: true }
    ).populate("requester");

    if (!request) {
      return res.status(400).json({
        message: "Request already accepted by another donor"
      });
    }

    /* ==============================
       CALCULATE DISTANCE
    ============================== */

    const donorCoords = donor.location.coordinates;      // [lng, lat]
    const seekerCoords = request.location.coordinates;   // [lng, lat]

    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // km
    const dLat = toRad(seekerCoords[1] - donorCoords[1]);
    const dLon = toRad(seekerCoords[0] - donorCoords[0]);

    const lat1 = toRad(donorCoords[1]);
    const lat2 = toRad(seekerCoords[1]);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) *
      Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = (R * c).toFixed(1); // in KM

    /* ==============================
       SEND EMAIL TO SEEKER
    ============================== */

    await sendEmail(
      request.requester.email,
      "🚑 Donor On The Way - PulseLink",
      `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f6f8; padding: 20px; border-radius: 8px;">
        <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e0e0e0;">
          
          <div style="background-color: #2e7d32; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 22px; letter-spacing: 1px;">🚑 DONOR ON THE WAY</h2>
          </div>
          
          <div style="padding: 30px;">
            <h3 style="color: #2e7d32; margin-top: 0; font-size: 20px;">Good News!</h3>
            <p style="font-size: 16px; color: #555555; line-height: 1.5;">A donor has accepted your blood request and is currently on their way to help.</p>
            
            <div style="background-color: #e8f5e9; border-left: 4px solid #2e7d32; padding: 15px; margin: 25px 0; border-radius: 0 4px 4px 0;">
              <p style="margin: 5px 0; font-size: 16px; color: #333333;"><b>Donor Name:</b> <span style="font-weight: bold;">${donor.userId.fullName}</span></p>
              <p style="margin: 5px 0; font-size: 16px; color: #333333;"><b>Distance:</b> ${distance} km away</p>
              <p style="margin: 5px 0; font-size: 16px; color: #333333;"><b>Contact:</b> ${donor.userId.phone || "Check app"}</p>
            </div>
          </div>
          
          <div style="background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="margin: 0; font-size: 15px; color: #444444; font-weight: bold;">Stay ready. You are not alone ❤️</p>
          </div>
          
        </div>
      </div>
      `
    );

    /* ==============================
       CREATE IN-APP NOTIFICATION
    ============================== */

    await Notification.create({
      user: request.requester._id,
      title: "🚑 Donor On The Way",
      message: `${donor.userId.fullName} is ${distance} km away and coming to donate.`
    });

    /* ==============================
       SOCKET EMIT ONLY TO SEEKER
    ============================== */

    const io = req.app.get("io");

// Emit ONLY to seeker
io.to(request.requester._id.toString()).emit("donorOnTheWay", {
  requestId: request._id,
  donorName: donor.userId.fullName,
  distance,
  phone: donor.userId.phone
});

    res.json({
      message: "Request accepted successfully",
      request,
      distance
    });

  } catch (error) {
    console.error("respondToRequest error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

