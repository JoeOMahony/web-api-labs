import dotenv from 'dotenv';
import express from 'express';
import tasksRouter from './api/tasks';
import './db';
import cors from 'cors';
import usersRouter from './api/users';
import authenticate from './authenticate';

dotenv.config();

// Error handling middleware callback to prevent asynchandler error including validation error details, line numbers , file locations, script names. 
const errHandler = (err, req, res, next) => {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }
  res.status(500).send(`Hey!! You caught the error 👍👍. Here's the details: ${err.stack} `);
};

const app = express();

// Enable CORS for all requests
app.use(cors()); // top of M/W stack

const port = process.env.PORT;

app.use(express.static('public'));

app.use(express.json());

// We add a “catch all” route BEFORE all the other routes. This means that any type of request coming in to 
// /api/tasks/… will pass through the authenticate controller and will be checked for a valid JWT token.
app.use('/api/tasks', authenticate, tasksRouter);

// Users router
app.use('/api/users', usersRouter);

app.use(errHandler); // keep at bottom of m/w stack

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});

