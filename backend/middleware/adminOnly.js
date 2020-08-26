const HTTP = require('http-status-codes');

module.exports = (req, res, next) => {
    if (req.loggedUser && !req.loggedUser.isAdmin) {
        return res.sendStatus(HTTP.FORBIDDEN);
    }

    return next();
};
