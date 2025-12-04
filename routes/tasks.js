const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    logging: false
});
const Task = require('../models/Task')(sequelize);

// GET all tasks
router.get('/', async (req, res) => {
    const tasks = await Task.findAll({ where: { userId: req.session.user.id } });
    res.render('tasks', { tasks });
});

// GET add form
router.get('/add', (req, res) => res.render('add-task'));

// POST create task
router.post('/add', async (req, res) => {
    await Task.create({
        title: req.body.title,
        description: req.body.description || null,
        dueDate: req.body.dueDate || null,
        status: req.body.status || 'pending',
        userId: req.session.user.id
    });
    res.redirect('/tasks');
});

// GET edit form
router.get('/edit/:id', async (req, res) => {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.session.user.id } });
    if (!task) return res.redirect('/tasks');
    res.render('edit-task', { task });
});

// POST update task
router.post('/edit/:id', async (req, res) => {
    await Task.update(req.body, { where: { id: req.params.id, userId: req.session.user.id } });
    res.redirect('/tasks');
});

// POST delete
router.post('/delete/:id', async (req, res) => {
    await Task.destroy({ where: { id: req.params.id, userId: req.session.user.id } });
    res.redirect('/tasks');
});

// POST toggle status
router.post('/status/:id', async (req, res) => {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.session.user.id } });
    if (task) {
        task.status = task.status === 'completed' ? 'pending' : 'completed';
        await task.save();
    }
    res.redirect('/tasks'); 
});

module.exports = router;