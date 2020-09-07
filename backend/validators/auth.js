const { body } = require('express-validator');

module.exports = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('email can not be empty')
        .isEmail()
        .withMessage('must be valid email adress'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('password can not be empty')
        .isLength({ min: 6, max: 32 })
        .withMessage('password length must be between 6 and 32')
];
