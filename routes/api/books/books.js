/*
companies is currently a dummy set of endpoints, which will eventually be used for the app's functionality

*/

const mongoose = require("mongoose");
const passport = require("passport");
const router = require("express").Router();
const Books = mongoose.model("Books");

router.post("/createBook", (req, res) => {
  const book = req.body.payload.Book;

  const newBook = new Books(book);

  return newBook.save().then(() => res.send({ book: newBook }));
});

router.post("/getBooks", async (req, res) => {
  const userId = req.body.payload.User._id;

  const query = await Books.find({ author: userId });

  console.log(query);
  return res.send({ success: true, query });
});

module.exports = router;
