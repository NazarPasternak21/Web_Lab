const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.use(express.json());
app.use(express.static('public'));

const dbConfig = {
  host: '127.0.0.1', 
  user: 'root', 
  password: '--------', 
  database: 'weblab5' 
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Помилка підключення до бази даних: ' + err.stack);
    return;
  }
  console.log('Підключено до бази даних з ID ' + connection.threadId);
});

app.post('/laptops', (req, res) => {
  const laptopData = req.body;
  connection.query('INSERT INTO laptops SET ?', laptopData, (err, results) => {
    if (err) {
      console.error('Помилка створення лаптопа:', err);
      res.status(500).json({ message: 'Помилка сервера' });
      return;
    }
    res.status(201).json({ message: 'Лаптоп успішно створено' });
  });
});


app.get('/laptops', (req, res) => {
  connection.query('SELECT * FROM laptops', (err, results) => {
    if (err) {
      console.error('Помилка отримання лаптопів:', err);
      res.status(500).json({ message: 'Помилка сервера' });
      return;
    }
    res.json(results);
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); 
});

app.put('/laptops/:id', (req, res) => {
  const laptopId = req.params.id;
  const laptopData = req.body;
  connection.query('UPDATE laptops SET ? WHERE id = ?', [laptopData, laptopId], (err, results) => {
    if (err) {
      console.error('Помилка оновлення лаптопа:', err);
      res.status(500).json({ message: 'Помилка сервера' });
      return;
    }
    res.json({ message: 'Лаптоп успішно оновлено' });
  });
});


app.delete('/laptops/:id', (req, res) => {
  const laptopId = req.params.id;
  connection.query('DELETE FROM laptops WHERE id = ?', laptopId, (err, results) => {
    if (err) {
      console.error('Помилка видалення лаптопа:', err);
      res.status(500).json({ message: 'Помилка сервера' });
      return;
    }
    res.json({ message: 'Лаптоп успішно видалено' });
  });
});


app.listen(port, () => {
  console.log(`Сервер працює на порту ${port}`);
});
