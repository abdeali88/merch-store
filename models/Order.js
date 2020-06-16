const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const cartProductSchema = new mongoose.Schema(
  {
    product: {
      type: ObjectId,
      ref: 'Product',
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
    transaction_id: String,
    amount: Number,
    address: {
      state: String,
      city: String,
      pincode: String,
      address1: String,
      address2: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order, CartProduct };
