const User = require('../../db/models/user');
const bcrypt = require('bcryptjs');

module.exports = (req,res,next) => {
    User.findOne({ username: req.body.username }).lean()
    .then(user => {
        if(!req.body.password) {
            return res.status(400).json({ message: 'Invalid user info.' });
        }

        if(!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).json({ message: 'Invalid user info.' });
        }

        req.user = user;
        next();
    })
    .catch(err => {
        res.status(500).json(err);
    });
};