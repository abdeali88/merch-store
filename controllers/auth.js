const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('config');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { firstname, lastname, email, password } = req.body;

  try {
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        errors: [{ msg: 'This email already exists!' }],
      });
    }

    user = new User(req.body);

    await user.save();

    const payload = {
      _id: user._id,
    };

    const token = jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: '1hr',
    });

    if (!token) {
      return res.status(500).json({
        errors: [{ msg: 'Issue with server. Please try again later!' }],
      });
    }

    res.cookie('token', token, { expires: new Date(Date.now() + 3600) });

    res.json({
      token: token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      errors: [{ msg: 'Issue with server. Please try again later!' }],
    });
  }
};

exports.signin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid Credentials!' }] });
    }
    if (!user.authenticate(password)) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid Credentials!' }] });
    }

    const payload = {
      _id: user._id,
    };

    const token = jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: '1hr',
    });

    if (!token) {
      return res.status(500).json({
        errors: [{ msg: 'Issue with server. Please try again later!' }],
      });
    }

    res.cookie('token', token, { expires: new Date(Date.now() + 3600) });

    const { _id, firstname, lastname, role } = user;

    res.json({ token: token, user: { _id, email, firstname, lastname, role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({
    msg: 'User signout successful',
  });
};

//protected routes (check if user is signedIn, has valid token)
exports.isSignedIn = expressJwt({
  secret: config.get('jwtSecret'),
  requestProperty: 'auth',
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!checker) {
    return res.status(403).json({ errors: [{ msg: 'Access Denied!' }] });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res
      .status(403)
      .json({ errors: [{ msg: 'Access Denied, Not an Admin!' }] });
  }
  next();
};

// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(config.get('mailKey'));
//   const msg = {
//     to: email,
//     from: config.get('from'),
//     subject: 'Email Verification Link',
//     html: `<h2>Please click the below link to verify your account </h2>
//            <p>${config.get('clientURL')}/users/activate/${token}</p>
//            <hr/>
//            `,
//   };

//   sgMail.send(msg).then(
//     () => {
//       return res
//         .status(200)
//         .json({ msg: `Email has been sent to ${email}` });
//     },
//     (error) => {
//       console.error(error);

//       if (error.response) {
//         return res.status(200).json({ msg: error.response.body });
//       }
//     }
//   );
