const express = require('express');
const User = require('../models/User');
const router = express.Router();

// GET register
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// POST register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.render('register', { 
        error: 'Username or email already taken' 
      });
    }

    // Create new user → password auto-hashed by pre-save hook
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.redirect('/auth/login');
  } catch (err) {
    // ← THIS CATCH IS MISSING IN YOUR CODE RIGHT NOW
    console.error('Registration error:', err);
    res.render('register', { 
      error: 'Registration failed. Please try again.' 
    });
  }
});

// GET login
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// POST login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.render('login', { error: 'Invalid credentials' });
        }
        req.session.user = { id: user._id, email: user.email, username: user.username };
        res.redirect('/dashboard');
    } catch (err) {
        res.render('login', { error: 'Login failed' });
    }
});

// GET logout
router.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/auth/login');
});

module.exports = router;