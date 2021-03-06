const { body } = require('express-validator');

const create = [
    body('userId').trim().not().isEmpty().withMessage('Should not be empty'),

    body('startDate')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isISO8601()
        .withMessage('Invalid date format'),

    body('duration').not().isEmpty().withMessage('Should not be empty').isInt().withMessage('Should be integer type'),

    body('vacationsPerYear')
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isInt()
        .withMessage('Should be integer type')
];

const update = [...create];

module.exports = {
    create,
    update
};
