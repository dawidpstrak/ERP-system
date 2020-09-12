const express = require('express');
const authorization = require('../middleware/authenticate');
const adminOnly = require('../middleware/adminOnly');
const validate = require('../middleware/validate');
const contractValidator = require('../validators/contract');

const router = express.Router();

module.exports = di => {
    const contractController = di.get('controllers.contract');

    router.get('/', [authorization], (...args) => contractController.index(...args));

    router.post('/', [authorization, adminOnly], [contractValidator.create, validate], (...args) =>
        contractController.store(...args)
    );

    router.put('/:id', [authorization, adminOnly], [contractValidator.update, validate], (...args) =>
        contractController.update(...args)
    );

    router.delete('/:id', [authorization, adminOnly], (...args) => contractController.delete(...args));

    return router;
};
