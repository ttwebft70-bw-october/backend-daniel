const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(val) {
            if(!validator.isEmail(val)) {
                throw new Error('Valid email address is required.');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(val) {
            if(val.length < 6) {
                throw new Error('Password needs 6 or more characters.');
            }
        }
    }
});

module.exports = User;