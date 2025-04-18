const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const createAdmin = async () => {
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (!existingAdmin) {
      const adminUser = new User({
        username: "Admin",
        email: "admin@example.com",
        password: "admin081",
        role: "admin"
      });
      await adminUser.save();
      console.log("Admin user created");
    } else {
      console.log("Admin already exists");
    }
  };

  const loginAdmin = async (req, res) => {
    const { email, password } = req.body;  
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "Admin does not exist" });
      }
  
      
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
  
      
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret', // Use .env in production
        { expiresIn: '20m' }
    );
      return res.status(200).json({ message: "Admin logged in successfully", user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  };
  
  
  module.exports = {createAdmin, loginAdmin};