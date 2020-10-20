const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../../db/models/user');

const authenticate = require('../middleware/auth-login');
const authorize = require('../middleware/autho-mw');

router.get('/', authorize, async (req,res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch(err) {
        res.status(500).json(err);
    }
});

router.get('/:id', authorize, async (req,res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        const privateUser = {
            id: user._id,
            username: user.username
        }
        res.status(200).json(privateUser);
    } catch(err) {
        if(err.kind) {
            return res.status(404).json({ message: 'Cannot find user with provided ID.' });
        }
        res.status(500).json(err);
    }
});

router.post('/register', async (req,res) => {
    if(!req.body) {
        return res.status(400).json({ error: 'Missing required information.' });
    }
    try {
        const newUser = new User(req.body);
        await newUser.save();
        
        // const userObject = await User.findOne({ username: req.body.username }).lean();
        
        // const secret = process.env.JWT_SECRET;
        // const token = jwt.sign(userObject, secret, { expiresIn: '5hr' });

        // res.status(201).json({ token });
        res.status(201).json(newUser);
    } catch(err) {
        // if(err.errors) {
        //     const errors = Object.keys(err.errors);
        //     const errorData = [];

        //     errors.forEach(key => {
        //         errorData.push({ error: key, message: err.errors[key].message })
        //     });

        //     return res.status(400).json(errorData);
        // }

        // if(err.keyValue) {
        //     const error = Object.keys(err.keyValue);
        //     return res.status(400).json({ error: `${error[0]} is taken.` });
        // }

        res.status(500).json(err);
    }

});

router.post('/login', authenticate, async (req,res) => {
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(req.user, secret, { expiresIn: '5hr' });
    res.status(202).json({ token });
});

module.exports = router;