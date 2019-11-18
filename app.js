/*
Express is a framework that streamlines the HTTP calls within this web application.

The packages described below are used as middleware to help structure the data in desired ways:
Path clarifies the path within the given directory to make sure calls are being made to the correct paths.
Body-Parser structures the data so that it can be read in expected ways.
Cors works to ensure that requests from the client are coming from who they say they are, by allowing but checking cross-origin requests

Mongoose connects the web application to the MongoDB database

*/
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

//requires modularized files
require('./models/Users')
const passport = require('./config/passport');

const app = express();

//initializes middleware
//morgan makes server logging more human-readable
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI);

//requires all other paths so that they are accessible
app.use(require('./routes'));

//in the case of any errors
app.use((err, req, res) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

//server hoisted to run on localhost 8000
app.listen(8000, () => console.log('Server running on http://localhost:8000/'));
