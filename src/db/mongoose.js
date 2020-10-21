const mongoose = require('mongoose');
const uri = process.env.DB_URL;

mongoose.connect(uri, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true
})
.then(res => {
    console.log('Successfully connected to database server.');
})
.catch(err => {
    console.log(err)
});