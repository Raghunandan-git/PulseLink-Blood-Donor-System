//routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const {getMyDonations} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const { respondToRequest } = require('../controllers/donationController');



router.get(
  '/me',
  protect,
  allowRoles('donor'),
  getMyDonations
);

router.post(
  '/respond',
  protect,
  allowRoles('donor'),
  respondToRequest
);



module.exports = router;
