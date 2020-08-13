const HTTP = require('http-status-codes');
const { matchedData, validationResult } = require('express-validator');

module.exports = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (validationErrors.isEmpty()) {
        req.matchedData = matchedData(req);

        return next();
    }

    const errors = validationErrors.array().map(e => {
        return { message: e.msg, param: e.param };
    });

    return res.status(HTTP.BAD_REQUEST).json({ errors });
};
