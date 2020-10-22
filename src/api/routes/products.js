const router = require('express').Router();

const authorize = require('../middleware/autho-mw');

router.get('/', authorize, (req,res) => {
    res.status(200).json({ message: 'Product router works :)' });
});

module.exports = router;