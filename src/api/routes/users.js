const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../../db/models/user');

const authenticate = require('../middleware/auth-login');
const authorize = require('../middleware/autho-mw');
const findUser = require('../middleware/auth-single-user-mw');

router.get('/', authorize, async (req,res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch(err) {
        res.status(500).json(err);
    }
});

router.get('/:id', authorize, findUser, (req,res) => {
    res.status(200).json(req.user)
});

router.post('/register', async (req,res) => {
    if(!req.body) {
        return res.status(400).json({ error: 'Missing required information.' });
    }
    try {
        const newUser = new User(req.body);
        await newUser.save();
        
        const userObject = await User.find({ username: req.body.username }).lean();
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(userObject[0], secret, { expiresIn: '5hr' });

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

router.post('/login', authenticate, async (req,res) => {
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(req.user, secret, { expiresIn: '5hr' });
    res.status(202).json({ token });
});

router.put('/:id', authorize, findUser, async (req,res) => {
    try {
        if(req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, parseInt(process.env.BCRYPT_SALT));
        }
        const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body);
        res.status(202).json({ message: 'User updated successfully.' });
    } catch(err) {
        res.status(500).json(err);
    }
})

router.delete('/:id', authorize, findUser, async (req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(202).json(user);
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;