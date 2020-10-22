const router = require('express').Router();
const Product = require('../../db/models/product');

const authorize = require('../middleware/autho-mw');

router.get('/', authorize, async (req,res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch(err) {
        res.status(500).json(err);
    }
});

router.get('/:id', authorize, async (req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch(err) {
        res.status(500).json(err);
    }
});

router.post('/', authorize, async (req,res) => {
    try {
        const newProduct = new Product({ ...req.body, sellerId: req.userId });
        await newProduct.save();

        res.status(202).json(newProduct);
    } catch(err) {
        res.status(500).json(err);
    }
});

router.put('/:id', authorize, async (req,res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body);
        res.status(202).json({ message: 'Product has been succesfully updated!' });
    } catch(err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', authorize, async (req,res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(202).json({ message: 'Product deleted successfully!' });
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;