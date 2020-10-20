const mongoose = require('mongoose');
const config = require('../config');
const url = process.env.DB_URL || config.dbURL;

mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});