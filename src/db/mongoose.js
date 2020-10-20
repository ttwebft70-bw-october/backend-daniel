const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.dbURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});