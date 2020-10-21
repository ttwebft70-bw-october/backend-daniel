const User = require('../../db/models/user');

module.exports = async (req,res,next) => {
    try {
        const user = await User.findById(req.params.id).lean();
        const privateUser = {
            id: user._id,
            username: user.username
        }
        req.user = privateUser;
        next();
    } catch(err) {
        if(err.kind) {
            return res.status(404).json({ message: 'Cannot find user with provided ID.' });
        }
        res.status(500).json(err);
    }
}