import express from 'express';
import User from './userModel';

// The /api/users route will be used to authenticate and register users for the API. 
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// register(Create) User
router.post('/', async (req, res) => {
    await User(req.body).save();
    res.status(201).json({
        code: 201,
        msg: 'Successfuly created the new user.'
    });
});

export default router;