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
    return res.status(200).json(task); // 200 General success
});

// Add a new task
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

    const timestamp = new Date().toISOString();
    newTask.created_at = timestamp;
    newTask.updated_at = timestamp;

    tasksData.tasks.push(newTask);
    res.status(201).json(newTask); // 201 Successfully created new resource (POST/PUT)
    tasksData.total_results++;
});

// Update an existing task
// The Task id (which is in the route path), is extracted from req.params using object destructuring.
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasksData.tasks.findIndex(task => task.id === id); // task id is then used to find the task in the tasks array
    if (taskIndex === -1) {
        return res.status(404).json({ status: 404, message: 'Task not found' });
    }
    /* An updated task is created using the request body (using the spread operator ...)
    The existing task properties are pulled in, then the properties coming from the req.body (overwrite), then the id (overwrite, safeguard) */
    const updatedTask = { ...tasksData.tasks[taskIndex], ...req.body, id:id };
    updatedTask.updated_at = new Date().toISOString();
    tasksData.tasks[taskIndex] = updatedTask; // The original task is replaced with the updated version; and the updated version is returned as confirmation of a successful update.
    res.json(updatedTask);
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasksData.tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({status:404,message:'Task not found'});
    }

    tasksData.tasks.splice(taskIndex, 1);
    res.status(204).send(); // 204 Success, but no content to return
    tasksData.total_results--;
});

export default router;