const Charity = require('../models/charity');
const charityController = {
  createCharity : async(req, res) =>{
    try {
      const { name, description, address, contactEmail} = req.body;
      if (!name || !description || !address) {
        return res.status(400).json({ message: 'Name, description, and address are required' });
      }
      const existingCharity = await Charity.findOne({ name });
        if (existingCharity) {
            return res.status(400).json({ message: 'Charity name already exists' });
        }
      const charity = await Charity.create({ name, description: description || '', address: address || '', contactEmail: contactEmail || '' });
      res.status(201).json({
        message: 'Charity created successfully',
        charity: { id: charity._id, name, description, address },
      });
    } catch (error) {
      console.error('Error creating charity:', error);
      if (error.code === 11000 && error.keyPattern.name) {
        return res.status(400).json({ message: 'Charity name already exists' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  },

  getCharities : async (req, res) => {
    try {
      const charities = await Charity.find().sort({ createdAt: -1 });
      res.json(charities);
    } catch (error) {
      console.error('Error fetching charities:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = charityController;