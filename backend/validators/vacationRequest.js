const { body } = require('express-validator');

const create = [
    body('status').trim().not().isEmpty().withMessage('Should not be empty'),

    body('startDate')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isISO8601()
        .withMessage('Invalid date format'),

    body('endDate')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isISO8601()
        .withMessage('Invalid date format')
        .custom((endDate, { req }) => {
            const { startDate } = req.body;

            const isAfterStartDate = (startDate, endDate) => startDate < endDate;

            if (isAfterStartDate(startDate, endDate)) {
                return Promise.resolve();
            }

            return Promise.reject('end date must be after start date');
        })
];

const update = [...create];

module.exports = {
    create,
    update
};
