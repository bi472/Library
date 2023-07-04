const express = require('express');
const mongoose = require('mongoose')

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const userRouter = require('./routes/user')

const DATABASE_URL = process.env.mongoURL;

const app = express();
app.use(express.json())

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Ошибка подключения к базе данных:'));
db.once('open', () => {
  console.log('Успешное подключение к базе данных!');
});

app.use('/api/books', booksRouter)
app.use('/api/user', userRouter)
app.use('/', indexRouter)
app.use('/api/public', express.static(__dirname+'/public'))

const PORT = process.env.PORT || 3000
app.listen(PORT,
    () => {
        console.log(`Library app is listening at port ${PORT}`)
    })