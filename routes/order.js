const express = require('express');
const router = express.Router();
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById, clearCart } = require('../controllers/user');
const {
  getOrderById,
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getOrder,
} = require('../controllers/order');
const { updateStocks } = require('../controllers/product');

router.param('userId', getUserById);
router.param('orderId', getOrderById);

router.post(
  '/order/create/:userId',
  isSignedIn,
  isAuthenticated,
  updateStocks,
  clearCart,
  createOrder
);

router.get(
  '/orders/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

router.get('/order/:userId/:orderId', isSignedIn, isAuthenticated, getOrder);

router.get('/order/:userId/:orderId', isSignedIn, isAuthenticated, getOrder);

router.put(
  '/order/:orderId/status/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateOrderStatus
);

module.exports = router;
