const { body } = require('express-validator');

const { User } = require('../models');

const update = [
    body(['name'])
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isLength({ min: 3, max: 20 })
        .withMessage('Invalid name format. Min length is 3 chars. Max length is 20 chars'),

    body(['surname'])
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isLength({ min: 3, max: 20 })
        .withMessage('Invalid surname format. Min length is 3 chars. Max length is 20 chars'),

    body(['email'])
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isEmail()
        .withMessage('Email address is not valid!')
        .normalizeEmail()
        .bail()
        .custom(async (email, { req }) => {
            const { id } = req.body;

            const user = await User.findOne({
                where: {
                    email
                }
            });

            if (user && id !== user.id) {
                return Promise.reject('Email address already exists!');
            }

            return Promise.resolve('This email is free to use');
        }),

    body('birthDate')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isDate()
        .withMessage('Date has invalid format!')
];

const store = [...update];

store.push(
    body('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isLength({ min: 6, max: 32 })
        .withMessage('Password must be 6-32 characters in length')
);

module.exports = {
    update,
    store
};
