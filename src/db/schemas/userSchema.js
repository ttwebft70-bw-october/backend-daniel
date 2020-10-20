const { Schema } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const config = require('../../config');


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
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
    },
    role: {
        type: Number,
        default: 4
    }
});

userSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, config.bcSalt);
    next();
});

userSchema.post('save', function(doc, next) {
    console.log('Saved user!');
    next();
});

userSchema.pre('find', function(next) {
    this.select('_id username role');
    next();
});

module.exports = userSchema;