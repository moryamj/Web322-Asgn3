/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Maryam Jawed          Student ID: 170378236          Date: Dec 03, 2025
*
********************************************************************************/

require('dotenv').config();
require('pg');

const express = require('express');
const mongoose = require('mongoose');
const Sequelize = require('sequelize');
const session = require('client-sessions');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session
app.use(session({
    cookieName: 'session',
    secret: process.env.SESSION_SECRET,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    ephemeral: true
}));

// Auth Middleware
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/tasks', require('./middleware/auth'), require('./routes/tasks'));

// Dashboard & Home
app.get('/dashboard', require('./middleware/auth'), (req, res) => {
    res.render('dashboard', { user: req.session.user });
});

app.get('/', (req, res) => {
    req.session.user ? res.redirect('/dashboard') : res.render('index');
});

// 404 Page
app.use((req, res) => {
    res.status(404).render('404', { user: req.session.user || null });
});

// Start Server
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      bufferCommands: false
    });
    console.log('MongoDB connected');

    await sequelize.authenticate();
    console.log('PostgreSQL connected');

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();

module.exports = app;