const mongoose = require('mongoose');
const User = require('../models/User');
const { CartProduct } = require('../models/Order');
const Order = require('../models/Order');

//gets the userId and appends user to req.profile
exports.getUserById = async (req, res, next, userId) => {
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }
    const { _id, firstname, lastname, email, role, purchases } = user;
    req.profile = { _id, firstname, lastname, email, role, purchases };
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'User not found' });
    }
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
  next();
};

//returns user present in req.profile
exports.getUser = (req, res) => {
  return res.json(req.profile);
};

exports.updateUser = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      { _id: req.profile._id },
      { $set: req.body },
      { new: true, findOneAndModify: false }
    );
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    //update password because findOneAndUpdate does not affect virtual fields
    if (req.body.password !== null && req.body.password !== undefined) {
      user = await User.findById({ _id: req.profile._id });
      user.password = req.body.password;
      await user.save();
    }

    const { _id, firstname, lastname, email, role, purchases } = user;
    res.json({ _id, firstname, lastname, email, role, purchases });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'User not found' });
    }
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.profile._id }).populate(
      'user',
      ['firstname', 'lastname']
    );
    if (!orders) {
      return res.status(400).json({ msg: 'No orders found!' });
    }
    res.json(orders);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'No orders found' });
    }
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};

//middleware
exports.pushOrderInPurchaseList = async (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      size: product.size,
      color: product.color,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  //store this in DB
  try {
    await User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { purchases: purchases } },
      { new: true }
    );
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
  next();
};

exports.addToCart = async (req, res) => {
  userId = req.profile._id;
  productId = req.product._id;

  try {
    let cartProduct = await CartProduct.findOne({
      user: userId,
      product: productId,
    });

    if (cartProduct) {
      return res.status(400).json({ msg: 'Already in cart!' });
    }
    cartProduct = new CartProduct({
      user: userId,
      product: productId,
    });
    cartProduct.save();
    res.json({ msg: 'Added to cart!' });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};

exports.removeFromCart = async (req, res) => {
  userId = req.profile._id;
  productId = req.product._id;

  try {
    const product = await CartProduct.findOneAndDelete({
      user: userId,
      product: productId,
    });
    if (!product) {
      return res.status(400).json({ msg: 'Not in cart!' });
    }
    return res.json({ msg: 'Removed from cart!' });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};

exports.getCartProducts = async (req, res) => {
  userId = req.profile._id;
  try {
    const cartProducts = await CartProduct.find({ user: userId });
    return res.json(cartProducts);
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};

exports.getCart = async (req, res) => {
  userId = req.profile._id;
  try {
    const cart = await CartProduct.find({ user: userId }).populate('product', [
      '_id',
      'name',
      'size',
      'color',
      'material',
      'price',
    ]);
    return res.json(cart);
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};
