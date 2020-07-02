const express = require('express');
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const {
  getProductById,
  createProduct,
  getProduct,
  getSingleImage,
  getAllImages,
  removeProduct,
  getAllProducts,
  sameProduct,
  //   updateProduct,
} = require('../controllers/product');
const { getUserById } = require('../controllers/user');

router.param('userId', getUserById);
router.param('productId', getProductById);

router.post(
  '/product/create/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

router.get('/product/:productId', getProduct);

router.get('/product/image/:productId', getSingleImage);
router.get('/product/images/:productId', getAllImages);

router.post('/products', getAllProducts);

router.delete('/product/:productId/:userId', removeProduct);

router.put(
  '/product/:productId/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

module.exports = router;
