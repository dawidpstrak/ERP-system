const HTTP = require('http-status-codes');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(HTTP.UNAUTHORIZED);
    }

    jwt.verify(token, config.app.secretKey, (err, payload) => {
        if (err) {
            return res.sendStatus(HTTP.UNAUTHORIZED);
        }

        const { loggedUser } = payload;

        const isAdmin = loggedUser.roles.some(role => role.name === 'admin');

        req.loggedUser = loggedUser;
        req.loggedUser.isAdmin = isAdmin;

        return next();
    });
};
