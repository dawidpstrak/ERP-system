const express = require('express');
const authorization = require('../middleware/authenticate');

const router = express.Router();

module.exports = di => {
    const userController = di.get('controllers.user');

    router.get('/', [authorization], (...args) => userController.me(...args));

    return router;
};
