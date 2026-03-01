// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const {
  confirmDonation,
  getAllUsers,
  getAcceptedRequests,
  getAdminStats,
  getSOSRequests
  // getAllRequests
} = require('../controllers/adminController');

router.get('/dashboard',
    protect,
    allowRoles('admin'),
    (req, res) => {
        res.json({ message: 'Welcome Admin 👑' });
    }
);
router.get('/users', protect, allowRoles('admin'), getAllUsers);
router.get('/accepted-requests', protect, allowRoles('admin'), getAcceptedRequests);
router.get('/stats', protect, allowRoles('admin'), getAdminStats);
router.get(
  '/verify-requests',
  protect,
  allowRoles('admin'),
  getAcceptedRequests
);


router.post('/confirm-donation',
  protect,
  allowRoles('admin'),
  confirmDonation
);

router.get(
  '/sos-requests',
  protect,
  allowRoles('admin'),
  getSOSRequests
);

module.exports = router;