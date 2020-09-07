const express = require('express');
const authorization = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const vacationRequestValidator = require('../validators/vacationRequest');

const router = express.Router();

module.exports = di => {
    const vacationRequestController = di.get('controllers.vacationRequest');

    router.get('/', [authorization], (...args) => vacationRequestController.index(...args));
    router.post('/', [authorization], [vacationRequestValidator.create, validate], (...args) =>
        vacationRequestController.store(...args)
    );
    router.put('/:id', [authorization], [vacationRequestValidator.update, validate], (...args) =>
        vacationRequestController.update(...args)
    );
    router.delete('/:id', [authorization], (...args) => vacationRequestController.delete(...args));

    return router;
};
