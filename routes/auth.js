const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
  console.log('in gettokenfromheaders', req.headers.authorization)
  const { headers: { authorization } } = req;

  console.log('auth', authorization);
  if(authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

module.exports = auth;
