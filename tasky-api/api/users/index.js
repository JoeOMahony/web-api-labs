import express from 'express';
import User from './userModel';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

// The /api/users route will be used to authenticate and register users for the API. 
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// register(Create) / Authenticate User (Registration and login are handled by the /api/users route.)
router.post('/', asyncHandler(async (req, res) => {
    try {
        // checks for both username and password in the request.
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({ success: false, msg: 'Username and password are required.' });
        }
        // If the action parameter’s value is “register”, it attempts to create a new user in the database (using the mongoose User model).
        if (req.query.action === 'register') {
            await registerUser(req, res);
        } else { // Otherwise, it authenticates the user. The token is then returned to the client for use in future requests.
            await authenticateUser(req, res);
        }
    } catch (error) {
        // Log the error and return a generic error message
        console.error(error);
        res.status(500).json({ success: false, msg: 'Internal server error.' });
    }
}));

// The registerUser() function attempts to create a new user in the database (using the mongoose User model).
async function registerUser(req, res) {
    // Add input validation logic here
    await User.create(req.body);
    res.status(201).json({ success: true, msg: 'User successfully created.' });
}

// The authenticateUser() function, creates the JWT token using the SECRET and signed with the username 
// (essentially, we encode the user name in the token). The token is then returned to the client for use in future requests.
async function authenticateUser(req, res) {
    const user = await User.findByUserName(req.body.username);
    if (!user) {
        return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
        const token = jwt.sign({ username: user.username }, process.env.SECRET);
        res.status(200).json({ success: true, token: 'BEARER ' + token });
    } else {
        res.status(401).json({ success: false, msg: 'Wrong password.' });
    }
}

export default router;