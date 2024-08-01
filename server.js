const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: null,
  database: 'findit'
};

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
});

// Login endpoint
app.get('/login', (req, res) => {
  const { username, password } = req.query;

  if (username && password) {
    const query = 'SELECT * FROM `userdata` WHERE `username` = ? AND `password` = ?';
    connection.query(query, [username, password], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Помилка запиту до бази даних' });
        return;
      }

      if (results.length > 0) {
        res.status(200).json({success: true, result: results[0]});
      } else {
        res.status(401).json({ success: false, message: 'Невірний логін або пароль' });
      }
    });
  } else {
    res.status(400).json({ error: 'Ім`я користувача та пароль є обов`язковими' });
  }
});

// Register endpoint
app.post('/register', (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    res.status(400).json({ error: 'Ім`я користувача та пароль є обов`язковими' });
    return;
  }

  connection.query('SELECT * FROM `userdata` WHERE `userName` = ?', [userName], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: 'Помилка надсилання даних' });
      return;
    }

    if (results.length > 0) {
      res.status(409).json({ success: false, message: 'Користувач з таким іменем вже існує' });
    } else {
      connection.query('INSERT INTO `userdata` (`userName`, `password`) VALUES (?, ?)', [userName, password], (error, results) => {
        if (error) {
          res.status(500).json({ success: false, message: 'Помилка надсилання даних' });
          return;
        }

        const userId = results.insertId;  // Отримуємо ID новоствореного користувача
        const userPhotoUrl = "https://png.pngtree.com/thumb_back/fh260/background/20230408/pngtree-rainbow-curves-abstract-colorful-background-image_2164067.jpg";
        const userDescription = "";

        // Вставка даних в таблицю users
        connection.query('INSERT INTO `users` (`userId`, `userName`, `userPhotoUrl`, `userDescription`) VALUES (?, ?, ?, ?)', [userId, userName, userPhotoUrl, userDescription], (error, results) => {
          if (error) {
            res.status(500).json({ success: false, message: 'Помилка надсилання даних в таблицю users' });
            return;
          }

          res.status(201).json({ success: true, message: 'Реєстрація успішна!' });
        });

      });
    }
  });
});
//get user
app.get('/profile/:username', (req, res) => {
  const username = req.params.username;

  // Запит до таблиці users для отримання користувача за ім'ям користувача
  connection.query('SELECT * FROM `users` WHERE `userName` = ?', [username], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: 'Помилка отримання даних' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ success: false, message: 'Користувача не знайдено' });
      return;
    }

    // Повернення даних користувача
    res.status(200).json({success: true, result: results[0]});
  });
});

//new post
app.post('/new-post', (req, res) => {
  const { userId, userName, header, description, lat, lng } = req.body;

  // Перевірка, чи всі необхідні дані були надані
  if (!userId || !userName || !header || !lat || !lng) {
    res.status(400).json({ error: 'Усі поля є обов`язковими' });
    return;
  }

  // Запит для вставки нового запису в таблицю posts
  connection.query('INSERT INTO `posts` (`userId`, `userName`, `header`, `description`, `lat`, `lng`) VALUES (?, ?, ?, ?, ?, ?)', [userId, userName, header, description, lat, lng], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: 'Помилка надсилання даних' });
      return;
    }

    res.status(201).json({ success: true, message: 'Публікація успішно додана!', postId: results.insertId });
  });
});

//fetch-posts
app.get('/posts/:userId', (req, res) => {
  const userId = req.params.userId;

  // Запит до таблиці posts для отримання публікацій за userId
  connection.query('SELECT * FROM `posts` WHERE `userId` = ?', [userId], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: 'Помилка отримання даних' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ success: false, message: 'Публікації не знайдено' });
      return;
    }

    // Повернення публікацій користувача
    res.status(200).json({ success: true, posts: results });
  });
});



// subscriber 
app.get('/subscribers', (req, res) => {
  const { userId, clickedUserId, code } = req.query;

  // Перевірка, чи надані обидві змінні userId та subscriberId
  if (!userId || !clickedUserId) {
    res.status(400).json({ error: 'Поля userId та clickedUserId є обов`язковими' });
    return;
  }

  // провірка вашої підписки на користувача
  if(code == 0) {
    connection.query('SELECT * FROM `subscribers` WHERE `userId` = ? AND `subscribedToId` = ?', [userId, clickedUserId], (error, results) => {
      if (error) {
        res.status(500).json({ success: false, message: 'Помилка отримання даних' });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ success: false, message: 'Підписки не знайдено' });
        return;
      }

      // Повернення результатів пошуку
      res.status(200).json({ success: true, subscribers: results });
    });
  } else if(code == 1) { // завантаження підписок КЛІКНУТОГО(ПОТОЧНОГО) ПРОФІЛЮ
    connection.query('SELECT * FROM `subscribers` WHERE `userId` = ?', [clickedUserId], (error, results) => {
      if (error) {
        res.status(500).json({ success: false, message: 'Помилка отримання даних' });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ success: false, message: 'Підписок не знайдено' });
        return;
      }

      // Повернення результатів пошуку
      res.status(200).json({ success: true, subscriptions: results });
    });
  } else if(code == 2) { // завантаження підписників КЛІКНУТОГО(ПОТОЧНОГО) ПРОФІЛЮ
    connection.query('SELECT * FROM `subscribers` WHERE `subscribedToId` = ?', [clickedUserId], (error, results) => {
      if (error) {
        res.status(500).json({ success: false, message: 'Помилка отримання даних' });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ success: false, message: 'Підписників не знайдено' });
        return;
      }

      // Повернення результатів пошуку
      res.status(200).json({ success: true, subscribers: results });
    });
  }
});

//subscribe to
app.post('/subscribeTo', (req, res) => {
  const { userId, clickedUserId } = req.body;

  // Перевірка, чи надані обидві змінні userId та clickedUserId
  if (!userId || !clickedUserId) {
    res.status(400).json({ error: 'Поля userId та clickedUserId є обов`язковими' });
    return;
  }

  // Запит для вставки нового запису в таблицю subscribers
  connection.query('INSERT INTO `subscribers` (`userId`, `subscribedToId`) VALUES (?, ?)', [userId, clickedUserId], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: 'Помилка надсилання даних' });
      return;
    }

    res.status(201).json({ success: true, message: 'Підписка успішно додана!' });
  });
});



// пошук користувачів за введеними символами
app.get('/search', (req, res) => {
  const { userName } = req.query;

  // Перевірка, чи наданий параметр userName
  if (!userName) {
    res.status(400).json({ success: false, message: 'Почніть вводити ім`я користувача' });
    return;
  }

  // Запит до таблиці users для отримання записів, де userName починається на певні букви
  connection.query('SELECT * FROM `users` WHERE `userName` LIKE ?', [`%${userName}%`], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: 'Помилка отримання даних' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ success: false, message: 'Користувачів не знайдено' });
      return;
    }

    // Повернення знайдених записів
    res.status(200).json({ success: true, users: results });
  });
});

// FEED GENERATION
app.post('/getPosts', (req, res) => {
  const { subscriptions } = req.body;

  // Перевірка, чи масив subscriptions наданий і чи він не порожній
  if (!subscriptions  || subscriptions.length === 0) {
    res.status(400).json({ error: 'Масив subscriptions є обов`язковим і не може бути порожнім' });
    return;
  }

  // Формування масиву subscribedToIds з масиву subscriptions
  const subscribedToIds = subscriptions.map(subscription => subscription.subscribedToId);

  // Перевірка, чи масив subscribedToIds не порожній
  if (subscribedToIds.length === 0) {
    res.status(400).json({ error: 'Масив subscribedToIds не може бути порожнім' });
    return;
  }

  // Запит до таблиці posts для отримання записів, де userId міститься в масиві subscribedToIds
  const query = 'SELECT * FROM `posts` WHERE `userId` IN (?)';
  connection.query(query, [subscribedToIds], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: 'Помилка отримання даних' });
      return;
    }

    // Повернення знайдених записів
    res.status(200).json({ success: true, posts: results });
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});