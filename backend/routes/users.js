const express = require('express');
const router = express.Router();

const userValidator = require('../validators/user');
const validate = require('../middleware/validate');

module.exports = di => {
    const userController = di.get('controllers.user');

    router.get('/', (...args) => userController.index(...args));
    router.post('/', [userValidator.store, validate], (...args) => userController.store(...args));
    router.put('/:id', [userValidator.update, validate], (...args) => userController.update(...args));
    router.delete('/:id', (...args) => userController.delete(...args));

    return router;
};
