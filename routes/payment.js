const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const config = require('config');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const razorpay = new Razorpay({
  key_id: config.get('razorpayTestId'),
  key_secret: config.get('razorpayTestSecret'),
});
const { Order } = require('../models/Order');

router.post(
  '/payment/razorpay',
  isSignedIn,
  isAuthenticated,
  async (req, res) => {
    const payment_capture = 1;
    const amount = req.body.amount * 100;
    const currency = 'INR';

    const options = {
      amount: amount,
      currency,
      payment_capture,
    };
    try {
      const response = await razorpay.orders.create(options);
      res.json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      });
    } catch (error) {
      console.log(error.message);
    }
  }
);

router.post('/payment/verification', (req, res) => {
  // do a validation
  const razorpay_payment_id = req.body.razorpay_payment_id;
  const razorpay_order_id = req.body.razorpay_order_id;
  const razorpay_signature = req.body.razorpay_signature;

  const secret = config.get('razorpayTestSecret');

  const crypto = require('crypto');

  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    console.log(req.body);
    return res.status(200).json({ msg: 'Payment Success.' });
  } else {
    return res.status(422).json({ error: 'Payment Failed.' });
  }
});

module.exports = router;
