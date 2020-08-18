const { body } = require('express-validator');

const di = req => {
    return req.app.get('di');
};

const update = [
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

            const userRepository = di(req).get('repositories.user');

            const user = await userRepository.findByEmail(email);

            if (user && id !== user.id) {
                return Promise.reject('Email address already exists!');
            }

            return Promise.resolve('Email adress available');
        }),

    body(['roles'])
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .bail()
        .custom(async (roles, { req }) => {
            const roleRepository = di(req).get('repositories.role');

            const areAllRolesValid = (await roleRepository.getByNames(roles)).length === roles.length;

            if (areAllRolesValid) {
                return Promise.resolve('All roles has valid names');
            }

            return Promise.reject('Some role not exist');
        })
];

const store = [...update];

module.exports = {
    update,
    store
};
