const Donation = require('../models/donation');
const Charity = require('../models/charity');
const Transaction = require('../models/Transaction');
const axios = require('axios');

const donationController = {
  async createDonation(req, res) {
    try {
      const { type, amount, foodItems, charityId, deliveryAddress, paymentWallet } = req.body;
      const userId = req.user.id; // From JWT middleware

      // Validate input
      if (!type || (type === 'money' && !amount) || (type === 'food' && (!foodItems || !foodItems.length))) {
        return res.status(400).json({ message: 'Type, and amount (for money) or foodItems (for food) are required' });
      }

      // Validate charity if provided
      let charity = null;
      if (charityId) {
        charity = await Charity.findById(charityId);
        if (!charity) {
          return res.status(404).json({ message: 'Charity not found' });
        }
      }

      // Base donation data
      const donationData = {
        user: userId,
        type,
        amount: type === 'money' ? amount : undefined,
        foodItems: type === 'food' ? foodItems : undefined,
        charity: charity ? charity._id : null,
        status: type === 'money' ? 'pending' : 'pending', // Money donations wait for payment confirmation
      };

      if (type === 'money') {
        // Initialize Paystack transaction
        const paystackResponse = await axios.post(
          'http://localhost:8000/api/paystack/initialize',
          {
            email: req.user.email || 'test@example.com', // Use user email from JWT or fallback
            amount, // Amount in Naira
          },
          {
            headers: {
              Authorization: req.header('Authorization'), // Pass JWT
              'Content-Type': 'application/json',
            },
          }
        );

        if (paystackResponse.data.status !== 'success') {
          return res.status(500).json({ message: 'Failed to initialize Paystack transaction' });
        }

        const { reference, authorization_url } = paystackResponse.data.data;

        // Link Paystack reference to donation
        donationData.paystackReference = reference;
      }

      // Create donation
      const donation = await Donation.create(donationData);

      // For monetary donations, return Paystack authorization URL
      if (type === 'money') {
        return res.status(201).json({
          message: 'Donation initialized successfully',
          donation: {
            id: donation._id,
            type: donation.type,
            amount: donation.amount,
            charity: donation.charity,
            status: donation.status,
            paystackReference: donation.paystackReference,
            authorization_url: paystackResponse.data.data.authorization_url,
            createdAt: donation.createdAt,
          },
        });
      }

      // For food donations
      res.status(201).json({
        message: 'Donation submitted successfully',
        donation: {
          id: donation._id,
          type: donation.type,
          foodItems: donation.foodItems,
          charity: donation.charity,
          status: donation.status,
          createdAt: donation.createdAt,
        },
      });
    } catch (error) {
      console.error('Error creating donation:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async getMyDonations(req, res) {
    try {
      const donations = await Donation.find({ user: req.user.id })
        .populate('charity', 'name')
        .sort({ createdAt: -1 });
      res.json(donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async updateDonationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, deliveryAddress, paymentWallet } = req.body;

      if (!['approved', 'rejected', 'delivered'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const donation = await Donation.findById(id);
      if (!donation) {
        return res.status(404).json({ message: 'Donation not found' });
      }

      // For monetary donations, ensure payment is completed before approving
      if (donation.type === 'money' && status === 'approved') {
        const transaction = await Transaction.findOne({ reference: donation.paystackReference });
        if (!transaction || transaction.status !== 'completed') {
          return res.status(400).json({ message: 'Payment not completed' });
        }
      }

      donation.status = status;
      if (status === 'approved') {
        if (donation.type === 'money') {
          donation.paymentWallet = paymentWallet || 'platform-wallet-address';
        } else if (donation.type === 'food') {
          donation.deliveryAddress = deliveryAddress || '123 Platform St, City';
        }
      }

      await donation.save();

      res.json({
        message: `Donation ${status}`,
        donation: {
          id: donation._id,
          type: donation.type,
          amount: donation.amount,
          foodItems: donation.foodItems,
          charity: donation.charity,
          status: donation.status,
          deliveryAddress: donation.deliveryAddress,
          paymentWallet: donation.paymentWallet,
          paystackReference: donation.paystackReference,
        },
      });
    } catch (error) {
      console.error('Error updating donation:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async getAllDonations(req, res) {
    try {
      const donations = await Donation.find()
        .populate('user', 'email firstName')
        .populate('charity', 'name')
        .sort({ createdAt: -1 });
      res.json(donations);
    } catch (error) {
      console.error('Error fetching all donations:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = donationController;