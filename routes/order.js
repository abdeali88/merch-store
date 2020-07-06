const express = require('express');
const router = express.Router();
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById, clearCart } = require('../controllers/user');
const {
  getOrderById,
  createOrder,
  getAllOrders,
  updateOrderStatus,
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

router.get('/orders/:userId', isSignedIn, isAuthenticated, getAllOrders);

// router.get(
//   '/order/status/:userId',
//   isSignedIn,
//   isAuthenticated,
//   isAdmin,
//   getOrderStatus
// );

router.put(
  '/order/:orderId/status/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateOrderStatus
);

module.exports = router;
