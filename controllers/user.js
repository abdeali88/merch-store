const mongoose = require('mongoose');
const User = require('../models/User');
const { CartProduct, Order } = require('../models/Order');

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
    const orders = await Order.find({ user: req.profile._id }).sort({
      createdAt: 'desc',
    });

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
// exports.pushOrderInPurchaseList = async (req, res, next) => {
//   let purchases = [];
//   req.body.order.products.forEach((product) => {
//     purchases.push({
//       product: product,
//       amount: req.body.order.amount,
//       order_id: req.body.order.transaction_id,
//     });
//   });

//   //store this in DB
//   try {
//     await User.findOneAndUpdate(
//       { _id: req.profile._id },
//       { $push: { purchases: purchases } },
//       { new: true }
//     );
//   } catch (err) {
//     console.error(err.message);
//     return res
//       .status(500)
//       .json({ msg: 'Issue with server. Please try again later!' });
//   }
//   next();
// };

exports.addToCart = async (req, res) => {
  userId = req.profile._id;
  productId = req.product._id;

  try {
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
    await CartProduct.findOneAndDelete({
      user: userId,
      product: productId,
    });

    return res.json({ msg: 'Removed from cart!' });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};

exports.updateCart = async (req, res) => {
  userId = req.profile._id;
  productId = req.product._id;
  qty = req.body.qty;

  try {
    const product = await CartProduct.findOne({
      user: userId,
      product: productId,
    }).populate('product', 'stock');

    if (qty > product.product.stock) {
      return res.status(400).json({ msg: 'Product out of stock!' });
    }

    product.qty = qty;
    product.save();
    return res.json({ msg: 'Quantity updated!' });
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
    let cart = await CartProduct.find({ user: userId }).populate('product', [
      '_id',
      'name',
      'size',
      'color',
      'material',
      'price',
      'images',
    ]);
    return res.json(cart);
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};

//Bohot hard hack. Asynchronous ki wajeh se takleef. Lekin forEach ke baad hi execute hona chahiye response.json uske liye forEach ke bahar ek counter laga diya.
exports.checkInStock = async (req, res) => {
  userId = req.profile._id;
  try {
    let cart = await CartProduct.find({ user: userId }).populate('product', [
      '_id',
      'name',
      'size',
      'color',
      'material',
      'price',
      'stock',
      'gender',
      'images',
    ]);
    let updated_cart = [];
    let errors = [];

    let counter = 0;
    cart.forEach(async (cartItem) => {
      if (cartItem.product.stock === 0) {
        await CartProduct.findByIdAndDelete({ _id: cartItem._id });
        errors.push(`${cartItem.product.name} is out of stock!`);
        counter += 1;
        if (counter === cart.length) {
          return res.json({ cart: updated_cart, errors: errors });
        }
      } else if (
        cartItem.qty > cartItem.product.stock &&
        cartItem.product.stock > 0
      ) {
        const item = await CartProduct.findOneAndUpdate(
          { _id: cartItem._id },
          { qty: cartItem.product.stock },
          { new: true }
        ).populate('product', [
          '_id',
          'name',
          'size',
          'color',
          'material',
          'price',
          'stock',
          'images',
        ]);
        updated_cart.push(item);
        errors.push(
          `${cartItem.product.name} quantity is reduced to ${cartItem.product.stock}!`
        );
        counter += 1;
        if (counter === cart.length) {
          return res.json({ cart: updated_cart, errors: errors });
        }
      } else {
        updated_cart.push(cartItem);
        counter += 1;
        if (counter === cart.length) {
          return res.json({ cart: updated_cart, errors: errors });
        }
      }
    });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};

exports.getCartWithTotal = async (req, res) => {
  userId = req.profile._id;
  try {
    let cart = await CartProduct.find({ user: userId }).populate('product', [
      'price',
      '_id',
    ]);
    const cartItems = cart.map((cartItem) => ({
      ...cartItem._doc,
      product: cartItem.product._id,
    }));

    const cartTotal = cart
      .map((cartItem) => cartItem.product.price * cartItem.qty)
      .reduce((a, b) => a + b, 0);

    return res.json({ cartItems, total: cartTotal });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};

//clear cart during order middleware
exports.clearCart = async (req, res, next) => {
  userId = req.profile._id;
  try {
    await CartProduct.deleteMany({ user: userId });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
  next();
};
