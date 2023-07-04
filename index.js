const express = require('express');
const {v4: uuid} = require('uuid');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const userRouter = require('./routes/user')

const app = express();
app.use(express.json())

app.use('/api/books', booksRouter)
app.use('/api/user', userRouter)
app.use('/', indexRouter)
app.use('/api/public', express.static(__dirname+'/public'))

const PORT = process.env.PORT || 3000
app.listen(PORT,
    () => {
        console.log(`Library app is listening at port ${PORT}`)
    })