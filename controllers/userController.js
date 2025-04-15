const User = require('../models/user');

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
    };

    module.exports = userController;