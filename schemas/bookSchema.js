const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { Schema } = mongoose;

const bookSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  title: { type: String, required: true },
  description: String,
  authors: String,
  favorite: String,
  fileCover: String,
  fileName: String,
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;