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

module.exports = mongoose.model('CartProduct', cartProductSchema);
