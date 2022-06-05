/*
The express-jwt package takes the jwt token and validates it.
There are other functionalities that express-jwt harnesses for customized user experience.
*/

const jwt = require("express-jwt");

/*
Validates whether the client has sent a valid JWT Token by checking the headers of the client call to the server.
Structure of header is as follows: 'headers': 'Token ${token}'
*/

//Checks to see if there is a token that has been sent from the client
const getTokenFromHeaders = (req) => {
  const {
    headers: { authorization },
  } = req;

  if (authorization && authorization.split(" ")[0] === "Token") {
    return authorization.split(" ")[1];
  }
  return null;
};

/*
auth middleware validates whether jwt token is present. Upon validation, the middleware sets req.user object
userProperty is where the payload will be attached
*/
const auth = {
  required: jwt({
    secret: process.env.TOKEN_SECRET,
    userProperty: "payload",
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: process.env.TOKEN_SECRET,
    userProperty: "payload",
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

module.exports = auth;
