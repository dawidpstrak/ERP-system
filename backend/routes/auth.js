const express = require('express');
const router = express.Router();

module.exports = di => {
    const authController = di.get('controllers.auth');

    router.post('/login', (...args) => authController.login(...args));

    return router;
};
