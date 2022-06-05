/*
The crypto package generates the cryptographic password for salt and hash used in the user's methods.

The jsonwebtoken package generates the json web token that acts as the stateless authentication token in the application.
*/

const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

const UsersSchema = new Schema({
  email: String,
  hash: String,
  salt: String,
});

/*
The salt added to the hash ensures that even if different users' passwords are the same, they will have different hashes.

The hash uses sha512, which is a one-way encryption. This structure prevents hackers from accessing user accounts,
even if the database is compromised.
*/
UsersSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

/*
The way that a password is validated is by taking the same salt and running the same sha512 encryption function.
If the hash is the same as the hash stored in the user object, the password is validated.
*/
UsersSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

/*
The JSON Web Token contains 3 parts: the header, the payload, and the signature.

The header usually contains the type of the token (JWT) and the signing algorithm.
The payload contains the claims, which typically holds information about the user.
The signature contains the secret to verify integrity and validity of token.
*/
UsersSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    "nav_technical"
  );
};

/*
On authentication, this function returns a JSON object with the following properties
*/
UsersSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

mongoose.model("Users", UsersSchema);
