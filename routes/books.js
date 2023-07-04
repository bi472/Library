const express = require('express')
const router = express.Router()
const fileMulter = require('../middleware/file')
const axios = require('axios');

const { v4: uuid } = require('uuid');

class Book {
    constructor(
        id = uuid(),
        title = "",
        description = "",
        authors = "",
        favorite = "",
        fileCover = "",
        fileName = "",
        fileBook = "") {
        this.id = id
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileCover = fileCover
        this.fileName = fileName
        this.fileBook = fileBook
    }
}

const stor = {
    book: [
        new Book(),
        new Book(),
    ],
};

const COUNTER_URL = `http://counter-app:3002`

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

router.get('', (req, res) => {
    const { book } = stor;
    res.json(book)
})

router.get('/:id', async (req, res) => {
    const { book } = stor
    const { id } = req.params
    const idx = book.findIndex(el => el.id === id)

    if (idx !== -1) {
        counterFetch(id)
            .then((counterValue) => {
                console.log(counterValue);
                res.json({ bookData: book[idx], counterValue });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    else {
        res.status(404)
        res.json('404 || Page not found')
    }
})

router.post('', (req, res) => {
    const { book } = stor
    const { title, description } = req.body

    const newBook = new Book(uuid(), title, description)
    book.push(newBook)

    res.status(201)
    res.json(newBook)
}
)

router.post('/:id/upload-book',
    fileMulter.single('cover-book'),
    (req, res) => {
        const { book } = stor
        const { id } = req.params
        const idx = book.findIndex(el => el.id === id)
        if (req.file) {
            const { filename } = req.file

            if (idx !== -1) {
                book[idx].fileBook = filename
                res.json(`${filename}`)
            }
            else {
                res.status(404)
                res.json('404 || Page not found')
            }
        }
        res.json('Something went wrong.')
    }
)

router.get('/:id/download', (req, res) => {
    const { book } = stor
    const { id } = req.params
    const idx = book.findIndex(el => el.id === id)

    if (idx !== -1) {
        const file = `./public/books/${book[idx].fileBook}`
        res.download(file)
    }
    else {
        res.status(404)
        res.json('404 || Page not found')
    }
}
)

router.put('/:id', (req, res) => {
    const { book } = stor
    const { title, description } = req.body
    const { id } = req.params
    const idx = book.findIndex(el => el.id === id)

    if (idx !== -1) {
        book[idx] = {
            ...book[idx],
            title,
            description,
        }

        res.json(book[idx])
    }
    else {
        res.status(404)
        res.json('404 || Page not found')
    }
})

router.delete('/:id', (req, res) => {
    const { book } = stor
    const { id } = req.params
    const idx = book.findIndex(el => el.id === id)

    console.log(idx)

    if (idx !== -1) {
        book.splice(idx, 1)
        res.json('ok')
    } else {
        res.status(404)
        res.json("404 || Page not found")
    }
})

module.exports = router