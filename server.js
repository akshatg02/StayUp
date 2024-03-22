const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('public'));


app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'index'));
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


app.get('/rooms', (req, res) => {
    res.render('rooms');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});