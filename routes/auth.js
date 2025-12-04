const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /auth/register
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// POST /auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.render('register', { error: 'Username or email already taken' });
        }

        const user = new User({ username, email, password });
        await user.save();

        res.redirect('/auth/login');
    } catch (err) {
        console.error('Registration error:', err);
        res.render('register', { error: 'Registration failed. Please try again.' });
    }
});

// GET /auth/login
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        req.session.user = {
            id: user._id.toString(),
            username: user.username,
            email: user.email
        };

        res.redirect('/dashboard');
    } catch (err) {
        console.error('Login error:', err);
        res.render('login', { error: 'Login failed. Please try again.' });
    }
});

// GET /auth/logout
router.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/auth/login');
});

module.exports = router;