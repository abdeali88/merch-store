const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  signup,
  signin,
  signout,
  isSignedIn,
  googleSignin,
  facebookSignin,
} = require('../controllers/auth');

router.post(
  '/signup',
  [
    check('firstname', 'First name should have minimum 3 characters!').isLength(
      {
        min: 3,
      }
    ),
    check('lastname', 'Last name should have minimum 3 characters!').isLength({
      min: 3,
    }),
    check('email', 'Please enter a valid email!').isEmail(),
    check('password', 'Passwords should be atleast 6 characters!').isLength({
      min: 6,
    }),
  ],
  signup
);

router.post(
  '/signin',
  [
    check('email', 'Please enter a valid email!').isEmail(),
    check('password', 'Please enter a valid password!').exists(),
  ],
  signin
);

router.post('/signin/google', googleSignin);

router.post('/signin/facebook', facebookSignin);

router.get('/signout', signout);

module.exports = router;
