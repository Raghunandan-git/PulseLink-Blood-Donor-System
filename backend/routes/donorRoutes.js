//routes/donorRoutes.js
const express = require('express');
const router = express.Router();

const {
  getDonorProfile,
  createOrUpdateDonor,
  searchDonors,
  toggleAvailability
} = require('../controllers/donorController');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

/* ---------- Donor profile (protected) ---------- */
router.get('/profile', protect, allowRoles('donor'), getDonorProfile);
router.post('/profile', protect, allowRoles('donor'), createOrUpdateDonor);

/* ---------- Donor search (PUBLIC) ---------- */
router.get('/search', searchDonors);
router.patch(
  '/availability',
  protect,
  allowRoles('donor'),
  toggleAvailability
);


module.exports = router;
