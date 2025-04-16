const { loginAdmin } = require('../utils/createAdmin');
const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');

// router.get('/dashboard', isAdmin, (req, res) => {
//   res.json({ message: `Welcome Admin ${req.user.name}` });
// });

router.post("/login", loginAdmin);


module.exports = router;
