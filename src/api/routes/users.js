const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../../db/models/user');
const config = require('../../config');

const authorize = require('../middleware/auth-mw');

router.get('/', (req,res) => {
    res.status(200).json({ message: 'User router works :)' });
});

router.post('/register', async (req,res) => {
    if(!req.body) {
        return res.status(400).json({ error: 'Missing required information.' });
    }
    try {
        const newUser = new User(req.body);
        await newUser.save();

        const userObject = await User.findOne({ username: req.body.username }).lean();
        
        const token = jwt.sign(userObject, config.jwtSecret, { expiresIn: '5hr' });

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

        if(err.keyValue) {
            const error = Object.keys(err.keyValue);
            return res.status(400).json({ error: `${error[0]} is taken.` });
        }

        res.status(500).json(err);
    }
});

router.post('/login', authorize, async (req,res) => {
    const token = jwt.sign(req.user, config.jwtSecret, { expiresIn: '5hr' });
    res.status(202).json({ token });
});

module.exports = router;