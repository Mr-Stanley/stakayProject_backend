const express = require('express');
const router = express.Router();
const charityController = require('../controllers/charityController');
const auth = require('../middleware/auth');
const restrictTo = require('../middleware/restrictTo');
const isAdmin = require('../middleware/isAdmin');

router.post('/createCharity',isAdmin, charityController.createCharity);
router.get('/getAllCharities', charityController.getCharities);
router.get('/getCharity/:id', charityController.getCharityById);
router.patch('/updateCharity/:id',isAdmin, charityController.updateCharity);
router.delete('/deleteCharity/:id',isAdmin, charityController.deleteCharity);
router.get('/getCharityByName/:name', charityController.getCharityByName);

module.exports = router;