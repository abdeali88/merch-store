const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const cartProductSchema = new mongoose.Schema(
  {
    product: {
      type: ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    qty: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const CartProduct = mongoose.model('CartProduct', cartProductSchema);

const orderSchema = new mongoose.Schema(
  {
    products: [cartProductSchema],
    payment: {
      razorpay_payment_id: String,
      razorpay_order_id: String,
    },

    amount: Number,
    user: {
      type: ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      default: 'Recieved',
      enum: ['Recieved', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    },

    updated: Date,

    address: {
      name: String,
      state: String,
      city: String,
      pincode: String,
      address1: String,
      address2: String,
      contact: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order, CartProduct };
