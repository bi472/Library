const express = require('express');
const redis = require('redis');

const app = express();

const port = process.env.PORT || 3001;

const REDIS_URL = process.env.REDIS_URL || 'localhost';

const client = redis.createClient({ url: REDIS_URL });

(
  async () => {
    await client.connect();
  }
)()

// Маршрут для увеличения счетчика
app.post('/counter/:bookId/incr', async (req, res) => {
  const bookId = req.params.bookId;

  try {
    const counter = await client.incr(bookId);
    res.status(200).send({ message: `Количество просмотров книги ${bookId}`, counter })
  } catch (e) {
    res.status(500).send({ message: `Ошибка redis:`, exception: e })
  }
});

// Маршрут для получения значения счетчика
app.get('/counter/:bookId', async (req, res) => {
  const bookId = req.params.bookId;

  try {
    const counter = await client.get(bookId);
    res.status(200).send({ message: `Количество просмотров книги ${bookId}`, counter })
  } catch (e) {
    res.status(500).send({ message: `Ошибка redis:`, exception: e })
  }

});

app.listen(port, () => {
  console.log('Counter app is running on port', port);
});
