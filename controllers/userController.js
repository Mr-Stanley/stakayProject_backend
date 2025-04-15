const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = { async register (req, res)  {
        const { username, email, password, role } = req.body;
        try {

        if (!username || !email || !password) {
          return res.status(400).json({ message: 'username, email, and password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
        }


        const user = await User.create({ username, email, password, role: role || 'donor' });

        res.status(201).json({
          message: 'User created successfully',
          user: { id: user._id, username: user.username, email: user.email, role: user.role },
        });
    
      
      } catch (error) {
        if (error.code === 11000 && error.keyPattern.email) {
            return res.status(400).json({ message: 'Email already in use' });
          }
          console.error('Error creating user:', error);
          return res.status(500).json({ message: 'Server error' });
        }
    },
    

    async login (req, res) {
        const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      res.status(200).json({
        message: 'Login successful',
        accessToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },


async getUserProfile (req, res) {
    try {
      
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
    },
  };

    module.exports = userController;