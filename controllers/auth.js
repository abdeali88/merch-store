const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('config');
const jwt = require('jsonwebtoken');
// const expressJwt = require('express-jwt');

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ msg: errors.array()[0].msg });
  }
  const { firstname, lastname, email, password } = req.body;

  try {
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ msg: 'This email already exists!' });
    }

    user = new User(req.body);

    await user.save();

    const payload = {
      _id: user._id,
    };

    const token = jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: '20hr',
    });

    if (!token) {
      return res
        .status(500)
        .json({ msg: 'Issue with server. Please try again later!' });
    }

    res.cookie('token', token, { expires: new Date(Date.now() + 72000) });

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
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};

exports.signin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ msg: errors.array()[0].msg });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials!' });
    }
    if (!user.authenticate(password)) {
      return res.status(400).json({ msg: 'Invalid Credentials!' });
    }

    const payload = {
      _id: user._id,
    };

    const token = jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: '20hr',
    });

    if (!token) {
      return res
        .status(500)
        .json({ msg: 'Issue with server. Please try again later!' });
    }

    res.cookie('token', token, { expires: new Date(Date.now() + 72000) });

    const { _id, firstname, lastname, role } = user;

    res.json({ token: token, user: { _id, email, firstname, lastname, role } });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({
    msg: 'User signout successful',
  });
};

//protected routes (check if user is signedIn, has valid token)
exports.isSignedIn = (req, res, next) => {
  const tokenList = req.header('Authorization');
  const token = tokenList.split(' ')[1];
  //check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token' });
  }

  //verify token
  try {
    jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Invalid' });
      } else {
        req.auth = decoded;
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};

//custom middlewares
exports.isAuthenticated = (err, req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!checker) {
    return res.status(401).json({ msg: 'Access Denied!' });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(401).json({ msg: 'Access Denied, Not an Admin!' });
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
