const mongoose = require('mongoose');
const url = process.env.DB_URL;

mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});