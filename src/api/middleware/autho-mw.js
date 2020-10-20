const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = (req,res,next) => {
    if(!req.headers.authorization) {
        return res.status(401).json({ message: 'access denied.' });
    }
    
    jwt.verify(req.headers.authorization, config.jwtSecret, (err, decoded) => {
        if(err) {
            return res.status(401).json({ message: 'access denied.' });
        }

        if(2 < decoded.role) {
            return res.status(401).json({ message: 'access denied.' });
        }
        
        next();
    });
}