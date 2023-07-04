const express = require('express')
const router = express.Router()
const fileMulter = require('../middleware/file')
const axios = require('axios');
const Book = require('../schemas/bookSchema')

const COUNTER_URL = process.env.counterURL

async function counterFetch(bookId) {
    const url = `${COUNTER_URL}/counter/${bookId}/incr`;

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url,
        headers: {}
    };

    return axios.request(config)
        .then((response) => {
            const { counter } = response.data;
            return counter;
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
}

router.get('', async (req, res) => {
    try {
      const books = await Book.find();
      res.json(books);
    } catch (error) {
      console.error('Error retrieving the list of books:', error);
      res.status(500).json('Server Error');
    }
  });
  
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findById(id);
      
      if (book) {
        const counterValue = await counterFetch(id);
        console.log(counterValue);
        res.json({ bookData: book, counterValue });
      } else {
        res.status(404).json('404 || Page not found');
      }
    } catch (error) {
      console.error('Error retrieving book information:', error);
      res.status(500).json('Server Error');
    }
  });
  
  router.post('', async (req, res) => {
    try {
      const { title, description } = req.body;
      const newBook = new Book({ title, description });
      const savedBook = await newBook.save();
      res.status(201).json(savedBook);
    } catch (error) {
      console.error('Error creating a book:', error);
      res.status(500).json('Server Error');
    }
  });
  
  router.post('/:id/upload-book', fileMulter.single('cover-book'), async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findById(id);
  
      if (req.file) {
        const { filename } = req.file;
  
        if (book) {
          book.fileCover = filename;
          await book.save();
          res.json(filename);
        } else {
          res.status(404).json('404 || Page not found');
        }
      } else {
        res.json('Something went wrong.');
      }
    } catch (error) {
      console.error('Error uploading book cover:', error);
      res.status(500).json('Server Error');
    }
  });
  
  router.get('/:id/download', async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findById(id);
  
      if (book) {
        const file = `./public/books/${book.fileCover}`;
        res.download(file);
      } else {
        res.status(404).json('404 || Page not found');
      }
    } catch (error) {
      console.error('Error downloading book file:', error);
      res.status(500).json('Server Error');
    }
  });
  
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const book = await Book.findByIdAndUpdate(id, { title, description }, { new: true });
  
      if (book) {
        res.json(book);
      } else {
        res.status(404).json('404 || Page not found');
      }
    } catch (error) {
      console.error('Error updating book information:', error);
      res.status(500).json('Server Error');
    }
  });
  
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findByIdAndRemove(id);
  
      if (book) {
        res.json('ok');
      } else {
        res.status(404).json('404 || Page not found');
      }
    } catch (error) {
      console.error('Error deleting a book:', error);
      res.status(500).json('Server Error');
    }
  });

module.exports = router