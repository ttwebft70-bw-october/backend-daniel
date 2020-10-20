const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../db/models/user');
const config = require('../../config');

router.get('/', (req,res) => {
    res.status(200).json({ message: 'User router works :)' });
});

router.post('/', async (req,res) => {
    if(!req.body.password) {
        return res.status(400).json({ error: 'Password is required.' });
    }

    if(req.body.password.length < 6) {
        return res.status(400).json({ error: 'Password must contain 6 or more characters.' });
    }
    try {
        req.body.password = bcrypt.hashSync(req.body.password, config.bcSalt);
        const newUser = new User(req.body);
        await newUser.save();
        const token = jwt.sign(req.body, config.jwtSecret, { expiresIn: '5hr' });

        res.status(201).json({ token });
    } catch(err) {
        if(err.errors) {
            const errors = Object.keys(err.errors);
            const errorData = [];

            errors.forEach(key => {
                errorData.push({ error: key, message: err.errors[key].message })
            });

            return res.status(400).json(errorData);
        }
        res.status(500).json(err);
    }
});

module.exports = router;