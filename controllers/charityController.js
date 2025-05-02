const { get } = require('mongoose');
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
  getCharityById : async (req, res) => {
    try {
      const { id } = req.params;
      const charity = await Charity.findById(id);
      if (!charity) {
        return res.status(404).json({ message: 'Charity not found' });
      }else{
        res.json(charity);
      }
    } catch (error) {
      console.error('Error fetching charity:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  updateCharity : async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, address, contactEmail } = req.body;
      const charity = await Charity.findByIdAndUpdate(id, { name, description, address, contactEmail }, { new: true });
      if (!charity) {
        return res.status(404).json({ message: 'Charity not found' });
      }
      res.json({
        message: 'Charity updated successfully',
        charity: { id: charity._id, name, description, address },
      });
    } catch (error) {
      console.error('Error updating charity:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  deleteCharity : async (req, res) => {
    try {
      const { id } = req.params;
      const charity = await Charity.findByIdAndDelete(id);
      if (!charity) {
        return res.status(404).json({ message: 'Charity not found' });
      }
      res.json({ message: 'Charity deleted successfully' });
    } catch (error) {
      console.error('Error deleting charity:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  getCharityByName : async (req, res) => {
    try {
      const { name } = req.params;
      const charity = await Charity.findOne({ name });
      if (!charity) {
        return res.status(404).json({ message: 'Charity not found' });
      } else{
        res.json(charity);
      }
    } catch (error) {
      console.error('Error fetching charity:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

};

module.exports = charityController;