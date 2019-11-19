/*
users is the heart of auth for this web app. In this file, there are three endpoints:
/register
/login
/current
*/

const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('./auth');
const Users = mongoose.model('Users');

/*
/register is an endpoint that listens for information from a new user that wants to register an account

First, the user email and password are checked for existence.
Second, a new User is created with the user's email and the password is set by a salted hash.
Third, upon saving the new User, json object is sent back to the client
*/
router.post('/register', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  const finalUser = new Users(user);

  finalUser.setPassword(user.password);

  return finalUser.save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }));
});

/*
/login is an endpoint that listens for and validates user information from the client

First, the user email and password are checked for existence.
Second, the endpoint uses passport middleware to authenticate the email and password.
Third, upon validation, a jwt token is generated. JSON object sent back to the client.
*/
router.post('/login', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }

    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ userId: user.token, success: true });
    }

    return res.json({ resp: 'denied' });
  })(req, res, next);
});

/*
/current is an endpoint that listens for a jwt token to maintain persistence.

First, the auth middleware validates and decodes the jwt token.
Second, the user id, stored within the jwt token, is used to find a user in the database.
Third, JSON object is sent back to client.
*/
router.get('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  return Users.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    });
});

module.exports = router;
