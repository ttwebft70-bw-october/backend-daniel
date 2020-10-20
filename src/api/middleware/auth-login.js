const User = require('../../db/models/user');
const bcrypt = require('bcryptjs');

module.exports = (req,res,next) => {
    User.find({ username: req.body.username }).lean()
    .then(user => {
        if(!req.body.password) {
            return res.status(400).json({ message: 'Invalid user info.' });
        }

        console.log(user[0]);
        return User.findById(user[0]._id);
    })
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        res.status(500).json(err);
    });
};