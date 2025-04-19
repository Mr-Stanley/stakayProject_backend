const Donation = require('../models/donation');
const Charity = require('../models/charity');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const donationController = {
  async createDonation(req, res) {
    try {
      const { type, amount, foodItems, charityId, deliveryAddress, paymentWallet } = req.body;
      const userId = req.user.id; // Assuming you have user ID from the token
      
      if (!type || (type === 'money' && !amount) || (type === 'food' && (!foodItems || !foodItems.length))) {
        return res.status(400).json({ message: 'Type, and amount (for money) or foodItems (for food) are required' });
      }

      let charity = null;
      if (charityId) {
        charity = await Charity.findById(charityId);
        if (!charity) {
          return res.status(404).json({ message: 'Charity not found' });
        }
      }
      const donationData = {
        user: req.user.id,
        type,
        amount: type === 'money' ? amount : undefined,
        foodItems: type === 'food' ? foodItems : undefined,
        charity: charity ? charity._id : null,
      };

      if (type === 'money') {
        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: charity ? `Donation to ${charity.name}` : 'Donation to StaKay FoodBank',
                },
                unit_amount: amount * 100, // Stripe expects cents
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
          cancel_url: 'http://localhost:3000/cancel',
        });

        donationData.paymentSessionId = session.id;
        donationData.status = 'completed'; // No approval needed
      }

      const donation = await Donation.create({
        user: req.user.id,
        type,
        amount: type === 'money' ? amount : undefined,
        foodItems: type === 'food' ? foodItems : undefined,
        charity: charity ? charity._id : null,
      });

      res.status(201).json({
        message: 'Donation submitted successfully',
        donation: {
          id: donation._id,
          type: donation.type,
          amount: donation.amount,
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

      donation.status = status;
      if (status === 'approved') {
        if (donation.type === 'money') {
          donation.paymentWallet = paymentWallet || 'platform-wallet-address'; // Replace with your wallet
        } else if (donation.type === 'food') {
          donation.deliveryAddress = deliveryAddress || '123 Platform St, City'; // Replace with your address
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