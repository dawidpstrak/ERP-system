const express = require('express');
const router = express.Router();

const contractValidator = require('../validators/contract');
const validate = require('../middleware/validate');

module.exports = di => {
    const contractController = di.get('controllers.contract');

    router.get('/', (...args) => contractController.index(...args));
    router.post('/', [contractValidator.create, validate], (...args) => contractController.store(...args));
    router.put('/:id', [contractValidator.update, validate], (...args) => contractController.update(...args));
    router.delete('/:id', (...args) => contractController.delete(...args));

    return router;
};
