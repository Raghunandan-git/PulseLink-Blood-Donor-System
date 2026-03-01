//routes/bloodRequestRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const {
  createRequest,
  createSOSRequest,
  getOpenRequests,
  getMyRequests,
  cancelRequest
} = require('../controllers/bloodRequestController');


router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.get(
  '/',
  protect,
  allowRoles('donor'),
  getOpenRequests
);

router.post('/sos', protect, createSOSRequest);


router.patch('/:id/cancel', protect, cancelRequest);


module.exports = router;
