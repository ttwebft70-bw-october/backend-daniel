const express = require('express');
const helmet = require('helmet');
const app = express();

const userRouter = require('./api/routes/users');

// middleware
const logger = require('./api/middleware/logger');

app.use(helmet());
app.use(logger);
app.use(express.json());

// routes
app.use('/api/users', userRouter);

app.get('/', (req,res) => {
    res.status(200).json({ message: 'Welcome to my African-Marketplace API. :)' });
});

module.exports = app;