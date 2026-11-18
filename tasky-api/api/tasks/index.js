import express from 'express';
import Task from './taskModel';
import asyncHandler from 'express-async-handler';

const router = express.Router(); // eslint-disable-line

// Get all tasks
// When this endpoint is called, the populate('userId', 'username') uses the'userId' field to look up the 
// User collection and replaces the userId field in each Task with the corresponding username from the user document.
router.get('/', async (req, res) => {
    const tasks = await Task.find().populate('userId', 'username'); 
    res.status(200).json(tasks);
});

// Get a user's tasks
// This function takes in a user id and finds the tasks that contain that user id.
router.get('/user/:uid', async (req, res) => {
    const tasks = await Task.find({ userId: `${req.params.uid}`});
    res.status(200).json(tasks);
});

// create a task
router.post('/', asyncHandler(async (req, res) => { // route update for error handling by importing async handler and wrapping callback
    const task = await Task(req.body).save();
    res.status(201).json(task);
}));

// Update Task
router.put('/:id', async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await Task.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({ code:200, msg: 'Task Updated Successfully' });
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to find Task' });
    }
});

// delete Task
router.delete('/:id', async (req, res) => {
    const result = await Task.deleteOne({
        _id: req.params.id,
    });
    if (result.deletedCount) {
        res.status(204).json();
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to find Task' });
    }
});

export default router;
