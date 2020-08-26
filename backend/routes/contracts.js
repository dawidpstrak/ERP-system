const express = require('express');
const router = express.Router();

const authorization = require('../middleware/authenticate');
const validate = require('../middleware/validate');

const contractValidator = require('../validators/contract');

module.exports = di => {
    const contractController = di.get('controllers.contract');

    router.get('/', [authorization], (...args) => contractController.index(...args));

    router.post('/', [authorization], [contractValidator.create, validate], (...args) =>
        contractController.store(...args)
    );

    router.put('/:id', [authorization], [contractValidator.update, validate], (...args) =>
        contractController.update(...args)
    );

    router.delete('/:id', [authorization], (...args) => contractController.delete(...args));

    return router;
};
