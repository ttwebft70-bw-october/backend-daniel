const { Schema } = require('mongoose');

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    sellerId: {
        type: String,
        required: true,
        trim: true
    },
    picture: {
        type: String,
        trim: true,
        default: null
    }
});

productSchema.post('save', function(doc, next) {
    console.log('Product saved!');
    next();
});

module.exports = productSchema;