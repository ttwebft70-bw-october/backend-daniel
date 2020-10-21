const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    const secret = process.env.JWT_SECRET;
    if(!req.headers.authorization) {
        return res.status(401).json({ message: 'access denied.' });
    }

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
    
            if(2 < decoded.role) {
                return res.status(401).json({ message: 'access denied.' });
            }
    
            next();
        });
    }
}