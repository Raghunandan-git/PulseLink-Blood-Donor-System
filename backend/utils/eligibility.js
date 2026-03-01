//utils/eligibility.js
const Donation = require('../models/Donation');

const isEligibleToDonate = async (donor) => {
  if (!donor.dob || !donor.weight) return false;

  // Age
  const dob = new Date(donor.dob);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  if (age < 18 || age > 65) return false;

  // Weight
  if (donor.weight < 50) return false;

  // 🔥 Fetch last donation dynamically
  const lastDonation = await Donation.findOne({ donor: donor._id })
    .sort({ donatedAt: -1 });

  if (lastDonation) {
    const diffDays =
      (today - new Date(lastDonation.donatedAt)) / (1000 * 60 * 60 * 24);

    if (diffDays < 90) return false;
  }

  return true;
};

module.exports = isEligibleToDonate;
