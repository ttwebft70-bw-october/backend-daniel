const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const app = express();

const userRouter = require('./api/routes/users');
const productRouter = require('./api/routes/products');

// middleware
const logger = require('./api/middleware/logger');

app.use(helmet());
app.use(logger);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);

app.get('/', (req,res) => {
    res.status(200).json({ message: 'Welcome to my African-Marketplace API. :)' });
});

module.exports = app;