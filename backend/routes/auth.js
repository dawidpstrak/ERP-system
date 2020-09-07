const express = require('express');
const validate = require('../middleware/validate');
const authValidator = require('../validators/auth');

const router = express.Router();

module.exports = di => {
    const authController = di.get('controllers.auth');

    router.post('/login', [authValidator, validate], (...args) => authController.login(...args));

    return router;
};
