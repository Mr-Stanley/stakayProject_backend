// generate-signature.js
const crypto = require('crypto');
const secret = 'sk_test_xxxxxxxxxxxxxxxx'; // Your PAYSTACK_SECRET_KEY
const body = JSON.stringify({
  event: 'charge.success',
  data: {
    reference: '838znng0q8', // Replace with TRANSACTION_REFERENCE
    status: 'success',
    amount: 100000,
    currency: 'NGN',
    customer: { email: 'test@stkayfoodbank.com' }
  }
});
const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
console.log('Signature:', hash);