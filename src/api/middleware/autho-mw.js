const jwt = require('jsonwebtoken');
const Product = require('../../db/models/product');

module.exports = (req,res,next) => {
    const secret = process.env.JWT_SECRET;
    if(!req.headers.authorization) {
        return res.status(401).json({ message: 'access denied.' });
    }

    if(req.originalUrl.includes('users')) {
        if(req.method === 'DELETE' || req.method === 'PUT') {
            jwt.verify(req.headers.authorization, secret, (err, decoded) => {
                if(err) {
                    return res.status(401).json({ message: 'access denied.' });
                }
        
                if(decoded.role < 3 || req.params.id === decoded._id) {
                    req.token = decoded;
                    next();
                } else {
                    return res.status(401).json({ message: 'access denied.' });
                }
            });
        } else {
            jwt.verify(req.headers.authorization, secret, (err, decoded) => {
                if(err) {
                    return res.status(401).json({ message: 'access denied.' });
                }
        
                next();
            });
        }
    } else if(req.originalUrl.includes('products')) {
        if(req.method === 'DELETE' || req.method === 'PUT') {
            jwt.verify(req.headers.authorization, secret, async (err, decoded) => {
                if(err) {
                    return res.status(401).json({ message: 'access denied.' });
                }

                try {
                    const product = await Product.findById(req.params.id).lean();

                    if(decoded.role < 3 || product.sellerId === decoded._id) {
                        req.decoded = decoded;
                        next();
                    } else {
                        return res.status(401).json({ message: 'access denied.' });
                    }
                } catch(err) {
                    return res.status(500).json('MW', err);
                }
            });
        } else {
            jwt.verify(req.headers.authorization, secret, (err, decoded) => {
                if(err) {
                    return res.status(401).json({ message: 'access denied.' });
                } else {
                    req.userId = decoded._id;
                    next();
                }
            });
        }
    }
}