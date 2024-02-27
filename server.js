const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

// let loggedIn = false;

// const checkLoggedIn = (req, res, next) => {
//     if (loggedIn) {
//         next();
//     } else {
//         res.redirect('/login');
//     }
// };

app.use(express.static('public'));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/registration', (req, res) => {
    res.render('registration');
});

// app.post('/login', (req, res) => {
//     const { username, password } = req.body;

//     if (username === 'admin@123' && password === 'admin') {
//         loggedIn = true;
//         res.redirect('/rooms');
//     } else {
//         res.redirect('/login');
//     }
// });

app.get('/rooms', /*checkLoggedIn,*/ (req, res) => {
    res.render('rooms');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});