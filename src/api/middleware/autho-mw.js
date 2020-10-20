const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = (req,res,next) => {
    const secret = process.env.JWT_SECRET || config.jwtSecret;
    if(!req.headers.authorization) {
        return res.status(401).json({ message: 'access denied.' });
    }
    
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