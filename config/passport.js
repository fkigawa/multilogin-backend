const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');


const Users = mongoose.model('Users');

passport.serializeUser(function(user, done) {
  console.log('in serialize')
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  console.log('in deserialize')
  Users.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
}, (email, password, done) => {
  Users.findOne({ email })
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }

      return done(null, user);
    }).catch(done);
}));

module.exports = passport;
