import express from 'express';
import User from './userModel';
import asyncHandler from 'express-async-handler';

// The /api/users route will be used to authenticate and register users for the API. 
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// register(Create) / Authenticate User (Registration and login are handled by the /api/users route.)
router.post('/', asyncHandler(async (req, res) => {
    // The action will indicate if the payload (i.e. the contents in the request body) is to be used to register or authenticate the User.
    // i.e., the behaviour is determined by the action query parameter.
    if (req.query.action === 'register') {  // if action is 'register' then save to DB
        await User(req.body).save();
        res.status(201).json({
            code: 201,
            msg: 'Successful created new user.',
        });
    }
    else {  // Must be an authenticate then!!! Query the DB and check if there's a match
        const user = await User.findOne(req.body);
        if (!user) {
            return res.status(401).json({ code: 401, msg: 'Authentication failed' });
        }else{
            return res.status(200).json({ code: 200, msg: "Authentication Successful", token: 'TEMPORARY_TOKEN' });
        }
    }
}));

export default router;