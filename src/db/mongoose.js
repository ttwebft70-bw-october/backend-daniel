const mongoose = require('mongoose');
const uri = process.env.DB_URL;

mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})
.then(res => {
    console.log('Successfully connected to database server.');
})
.catch(err => {
    console.log(err)
});

mongoose.set('debug', true);