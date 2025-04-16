const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const auth = require('../middleware/auth');
const restrictTo = require('../middleware/restrictTo');

router.post('/', auth, donationController.createDonation);
router.get('/my-donations', auth, donationController.getMyDonations);
router.patch('/:id', auth, restrictTo('admin'), donationController.updateDonationStatus);
router.get('/all', auth, restrictTo('admin'), donationController.getAllDonations);
module.exports = router;