const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { Schema } = mongoose;

const bookSchema = new Schema({
  id: { type: String, default: uuidv4, unique: true },
  title: { type: String, required: true },
  description: String,
  authors: String,
  favorite: String,
  fileCover: String,
  fileName: String,
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;