const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send({
        message: 'Access Denied, Not Token Provided'
    });

    try {
        const decoded = jwt.verify(token, process.env.MY_JWT_PRIVATE_KEY);
        req.user = decoded;

        next();
    } catch (error) {
        res.status(400).json({
            message: 'Invalid token'
        });
    }

}