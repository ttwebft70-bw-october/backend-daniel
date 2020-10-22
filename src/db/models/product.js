const { model } = require('mongoose');
const productSchema = require('../schemas/productSchema');

const Product = model('product', productSchema);

module.exports = Product;