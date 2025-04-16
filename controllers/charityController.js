const Charity = require('../models/charity');

const charityController = {
  async createCharity(req, res) {
    try {
      const { name, description, address } = req.body;
      if (!name || !description || !address) {
        return res.status(400).json({ message: 'Name, description, and address are required' });
      }
      const charity = await Charity.create({ name, description, address });
      res.status(201).json({
        message: 'Charity created successfully',
        charity: { id: charity._id, name, description, address },
      });
    } catch (error) {
      console.error('Error creating charity:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async getCharities(req, res) {
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