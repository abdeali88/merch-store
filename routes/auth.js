const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { signup, signin, signout, isSignedIn } = require('../controllers/auth');

router.post(
  '/signup',
  [
    check('firstname', 'Name should have minimum 3 characters!').isLength({
      min: 3,
    }),
    check('lastname', 'Name should have minimum 3 characters!').isLength({
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

router.get('/signout', signout);

router.get('/test', isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;
