const mongoose = require("mongoose");

const { Schema } = mongoose;

const BooksSchema = new Schema({
  author: {
    type: mongoose.ObjectId,
    ref: "Users",
    required: true,
  },
  title: String,
  numberOfPages: Number,
  yearOfPublishing: Number,
});

mongoose.model("Books", BooksSchema);
