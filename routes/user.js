const express = require('express');
const router = express.Router();
const {
  getUserById,
  getUser,
  updateUser,
  getOrders,
  addToCart,
  getCartProducts,
  getCart,
  removeFromCart,
  updateCart,
  getCartWithTotal,
  checkInStock,
} = require('../controllers/user');
const { getProductById } = require('../controllers/product');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');

router.param('userId', getUserById);
router.param('productId', getProductById);

router.get('/user/:userId', isSignedIn, isAuthenticated, getUser);

router.get(
  '/user/cart/products/:userId',
  isSignedIn,
  isAuthenticated,
  getCartProducts
);

router.get('/user/cart/:userId', isSignedIn, isAuthenticated, getCart);

router.get(
  '/user/check/cart/stock/:userId',
  isSignedIn,
  isAuthenticated,
  checkInStock
);

router.get(
  '/user/cart/total/:userId',
  isSignedIn,
  isAuthenticated,
  getCartWithTotal
);

router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);

router.put(
  '/user/add/cart/:userId/:productId',
  isSignedIn,
  isAuthenticated,
  addToCart
);

router.put(
  '/user/remove/cart/:userId/:productId',
  isSignedIn,
  isAuthenticated,
  removeFromCart
);

router.put(
  '/user/update/cart/:userId/:productId',
  isSignedIn,
  isAuthenticated,
  updateCart
);

router.get('/orders/user/:userId', isSignedIn, isAuthenticated, getOrders);

module.exports = router;
