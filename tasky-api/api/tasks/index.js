import express from 'express';
import { tasksData } from './tasksData.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// get all tasks
router.get('/', (req, res) => {
    res.json(tasksData);
});

// Get task details
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const task = tasksData.tasks.find(task => task.id === id);
    if (!task) {
        return res.status(404).json({ status: 404, message: 'Task not found' });
    }
    return res.status(200).json(task);
});

// Adds a new task
router.post('/', (req, res) => {
    const { title, description, deadline, done, priority } = req.body;
    const newTask = {
        id: uuidv4(),
        title,
        description,
        deadline,
        done,
        priority
    };
    tasksData.tasks.push(newTask);
    res.status(201).json(newTask);
    tasksData.total_results++;
});

export default router;