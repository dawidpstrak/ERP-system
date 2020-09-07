const express = require('express');
const adminOnly = require('../middleware/adminOnly');
const authorization = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const userValidator = require('../validators/user');

const router = express.Router();

module.exports = di => {
    const userController = di.get('controllers.user');

    router.get('/', [authorization, adminOnly], (...args) => userController.index(...args));

    router.get('/me', [authorization], (...args) => userController.me(...args));

    router.post('/', [authorization, adminOnly], [userValidator.store, validate], (...args) =>
        userController.store(...args)
    );

    router.put('/:id', [authorization, adminOnly], [userValidator.update, validate], (...args) =>
        userController.update(...args)
    );

    router.delete('/:id', [authorization, adminOnly], (...args) => userController.delete(...args));

    return router;
};
