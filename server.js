const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcrypt');


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

const db = pool;

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.use((req, res, next) => {
    const { path } = req;
    if (path === '/' && req.session.isAuthenticated) {
        req.session.isAuthenticated = false;
    }
    next();
});

app.post('/logout', (req, res) => {

    req.session.destroy(err => {
        if (err) {
            console.error('Error Destroying the session:', err);
            res.status(500).send('Error logging out');
        } else {
            res.sendStatus(200);
        }
    });
});

app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'index'));
});


app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home');
    } else {
        res.redirect('/');
    }
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

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    db.query('SELECT * FROM users WHERE email = $1', [email], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.rows.length === 0) {
            return res.status(401).send('Invalid email or password');
        }
        const hashedPassword = results.rows[0].password;

        bcrypt.compare(password, hashedPassword, (bcryptErr, bcryptResult) => {
            if (bcryptErr) {
                console.error('Error comparing passwords:', bcryptErr);
                return res.status(500).send('Internal server error');
            }
            if (!bcryptResult) {
                return res.status(401).send('Invalid email or password');
            }

            req.session.user = email;
            res.status(200).send('Login successful!');
        });
    });
});

app.post('/contact', (req, res) => {
    //console.log(req.body);
    const { name, email, msg } = req.body;

    if (!name || !email || !msg) {
        return res.status(400).send('All fields are required');
    }

    const sql = "INSERT INTO contact (name, email, msg) VALUES ($1, $2, $3)";
    db.query(sql, [name, email, msg], (err, result) => {
        if (err) {
            console.error("Error Contact: ", err);
            return res.status(500).send("Error Contacting");
        }
        console.log("Form Submitted successfully");

        return res.status(200).send("Form submitted Successfully!");
    });
});


app.get('/registration', (req, res) => {
    res.render('registration');
});

app.post('/registration', (req, res) => {
    const { name, email, password, confirm_password, phone } = req.body;

    if (password !== confirm_password) {
        return res.status(400).send("Passwords do not match");
    }
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.log("Error Hashing password: ", err);
            return res.status(500).send("Error Registering user");
        }
        const sql = "INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4)";
        db.query(sql, [name, email, hashedPassword, phone], (err, result) => {
            if (err) {
                console.error("Error inserting user data:", err);
                return res.status(500).send("Error inserting user data");
            }
            console.log("User registered successfully");
            return res.status(200).send("Registration successful");
        });
    });
});

app.get('/rooms', isAuthenticated, (req, res) => {
    res.render('rooms');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});