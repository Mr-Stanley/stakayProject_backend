const express = require('express');
const router = express.Router();
const charityController = require('../controllers/charityController');
const auth = require('../middleware/auth');
const restrictTo = require('../middleware/restrictTo');

router.get('/', charityController.getCharities);
router.post('/', auth, restrictTo('admin'), charityController.createCharity);

module.exports = router;