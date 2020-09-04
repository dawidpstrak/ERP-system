const express = require('express');
const router = express.Router();

const adminOnly = require('../middleware/adminOnly');
const authorization = require('../middleware/authenticate');
const validate = require('../middleware/validate');

const userValidator = require('../validators/user');

module.exports = di => {
    const userController = di.get('controllers.user');

    router.get('/', [authorization, adminOnly], (...args) => userController.index(...args));

    router.get('/:id', [authorization], (...args) => userController.show(...args));

    router.post('/', [authorization, adminOnly], [userValidator.store, validate], (...args) =>
        userController.store(...args)
    );

    router.put('/:id', [authorization, adminOnly], [userValidator.update, validate], (...args) =>
        userController.update(...args)
    );

    router.delete('/:id', [authorization, adminOnly], (...args) => userController.delete(...args));

    return router;
};
