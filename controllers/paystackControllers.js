const axios = require('axios');
const Transaction = require('../models/Transaction');
const crypto = require('crypto');

// Paystack secret key from environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Initialize a transaction
exports.initializeTransaction = async (req, res, next) => {
  try {
    const { email, amount } = req.body;

    // Validate input
    if (!email || !amount) {
      return res.status(400).json({ status: 'error', message: 'Email and amount are required' });
    }

    // Amount in kobo (Paystack expects amount in smallest currency unit)
    const amountInKobo = amount * 100;

    // Make request to Paystack to initialize transaction
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amountInKobo,
        callback_url: process.env.CALLBACK_URL || 'http://localhost:3000/payment/callback',
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Save transaction to database
    const transaction = new Transaction({
      email,
      amount,
      reference: response.data.data.reference,
      status: 'pending',
      userId: req.user ? req.user.id : null, // Assuming user is attached by auth middleware
    });
    await transaction.save();

    res.status(200).json({
      status: 'success',
      data: response.data.data, // Contains authorization_url and reference
    });
  } catch (error) {
    next(error); // Pass to error handler
  }
};

// Verify a transaction
exports.verifyTransaction = async (req, res, next) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({ status: 'error', message: 'Reference is required' });
    }

    // Verify transaction with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { status, amount, reference: paystackReference } = response.data.data;

    // Update transaction in database
    const transaction = await Transaction.findOne({ reference: paystackReference });
    if (!transaction) {
      return res.status(404).json({ status: 'error', message: 'Transaction not found' });
    }

    transaction.status = status === 'success' ? 'completed' : 'failed';
    transaction.amount = amount / 100; // Convert back to Naira
    await transaction.save();

    res.status(200).json({
      status: 'success',
      data: response.data.data,
    });
  } catch (error) {
    next(error);
  }
};

// Handle Paystack webhook
exports.handleWebhook = async (req, res, next) => {
  try {
    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).json({ status: 'error', message: 'Invalid webhook signature' });
    }

    const event = req.body;

    // Handle charge.success event
    if (event.event === 'charge.success') {
      const { reference, amount, status } = event.data;

      const transaction = await Transaction.findOne({ reference });
      if (transaction) {
        transaction.status = status === 'success' ? 'completed' : 'failed';
        transaction.amount = amount / 100;
        await transaction.save();
      }
    }

    res.status(200).json({ status: 'success', message: 'Webhook received' });
  } catch (error) {
    next(error);
  }
};