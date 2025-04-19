const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const {authenticateUser} = require('../middleware/auth');
const restrictTo = require('../middleware/restrictTo');
const isAdmin = require('../middleware/isAdmin');

router.post('/', authenticateUser, donationController.createDonation);
router.get('/my-donations', authenticateUser, donationController.getMyDonations);
router.patch('/:id', isAdmin, restrictTo('admin'), donationController.updateDonationStatus);
router.get('/all', isAdmin, restrictTo('admin'), donationController.getAllDonations);
module.exports = router;