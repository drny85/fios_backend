const User = require('../models/user');
module.exports = function (req, res, next) {
    
    User.findById(req.user._id)
    .select('roles')
    .then(user => {
        
    if (!user.roles.active) return res.status(403).send('Access denied');

    next();
    })
    .catch(err => {
        next(err);
    })
    
}