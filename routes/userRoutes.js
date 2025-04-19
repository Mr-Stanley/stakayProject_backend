const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authenticateUser} = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authenticateUser, userController.getUserProfile);

module.exports = router;