const { validationResult } = require('express-validator');
const User = require('../models/User');
const config = require('config');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const { OAuth2Client } = require('google-auth-library');

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
      expiresIn: '7d',
    });

    if (!token) {
      return res
        .status(500)
        .json({ msg: 'Issue with server. Please try again later!' });
    }

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
      expiresIn: '7d',
    });

    if (!token) {
      return res
        .status(500)
        .json({ msg: 'Issue with server. Please try again later!' });
    }

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
  res.json({
    msg: 'User signout successful',
  });
};

//google authentication
const googleAuth = new OAuth2Client(config.get('googleClientId'));
// Google Login
exports.googleSignin = (req, res) => {
  const { idToken } = req.body;

  googleAuth
    .verifyIdToken({ idToken, audience: config.get('googleClientId') })
    .then((response) => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, config.get('jwtSecret'), {
              expiresIn: '7d',
            });
            const { _id, email, firstname, lastname, role } = user;
            return res.json({
              token,
              user: { _id, email, firstname, lastname, role },
            });
          } else {
            let password = email + config.get('jwtSecret');
            let nameList = name.split(' ');
            let firstname, lastname;
            if (nameList.length === 1) {
              firstname = nameList[0];
              lastname = '';
            } else if (nameList.length === 2) {
              firstname = nameList[0];
              lastname = nameList[1];
            } else if (nameList.length === 3) {
              firstname = nameList[0];
              lastname = nameList[2];
            } else {
              firstname = nameList[0];
              lastname = nameList[-1];
            }
            user = new User({ firstname, lastname, email, password });
            user.save((err, data) => {
              if (err) {
                console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                return res.status(400).json({
                  msg: 'Google Signin Failed!',
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                config.get('jwtSecret'),
                { expiresIn: '7d' }
              );
              const { _id, email, firstname, lastname, role } = data;
              return res.json({
                token,
                user: { _id, email, firstname, lastname, role },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          msg: 'Google Signin failed! Please try again',
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

//facebook authentication
exports.facebookSignin = (req, res) => {
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return fetch(url, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((response) => {
      const { email, name } = response;
      User.findOne({ email }).exec((err, user) => {
        if (user) {
          const token = jwt.sign({ _id: user._id }, config.get('jwtSecret'), {
            expiresIn: '7d',
          });
          const { _id, email, name, role } = user;
          return res.json({
            token,
            user: { _id, email, name, role },
          });
        } else {
          let password = email + config.get('jwtSecret');
          let nameList = name.split(' ');
          let firstname, lastname;
          if (nameList.length === 1) {
            firstname = nameList[0];
            lastname = '';
          } else if (nameList.length === 2) {
            firstname = nameList[0];
            lastname = nameList[1];
          } else if (nameList.length === 3) {
            firstname = nameList[0];
            lastname = nameList[2];
          } else {
            firstname = nameList[0];
            lastname = nameList[-1];
          }
          user = new User({ firstname, lastname, email, password });
          user.save((err, data) => {
            if (err) {
              return res.status(400).json({
                msg: 'Facebook Signin Failed!',
              });
            }
            const token = jwt.sign({ _id: data._id }, config.get('jwtSecret'), {
              expiresIn: '7d',
            });
            const { _id, email, firstname, lastname, role } = data;
            return res.json({
              token,
              user: { _id, email, firstname, lastname, role },
            });
          });
        }
      });
    })
    .catch((error) => {
      res.json({
        msg: 'Facebook Signin failed. Try again!',
      });
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
  let checker =
    req.profile &&
    req.auth &&
    req.profile._id.toString() === req.auth._id.toString();

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
