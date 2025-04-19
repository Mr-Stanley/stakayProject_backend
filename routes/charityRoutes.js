const express = require('express');
const router = express.Router();
const charityController = require('../controllers/charityController');
const auth = require('../middleware/auth');
const restrictTo = require('../middleware/restrictTo');
const isAdmin = require('../middleware/isAdmin');

router.post('/createCharity',isAdmin, charityController.createCharity);
router.get('/getAllCharities', charityController.getCharities);

module.exports = router;