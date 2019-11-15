//npm packages to set up express framework + mongo database
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
const errorHandler = require('errorhandler');

//requiring modularized files
require('./models/Users')
const passport = require('./config/passport');

// mongoose.promise = global.Promise;

const isProduction = process.env.NODE_ENV

const app = express();

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

app.use(passport.initialize());
app.use(passport.session());


if(!isProduction) {
  app.use(errorHandler());
}

mongoose.connect(process.env.MONGODB_URI);
mongoose.set('debug', true);


// require('./config/passport');
app.use(require('./routes'));

if(!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

app.listen(8000, () => console.log('Server running on http://localhost:8000/'));
