const express = require('express');
const router = express.Router();

const authorization = require('../middleware/authenticate');

module.exports = di => {
    const vacationRequestController = di.get('controllers.vacationRequest');

    router.get('/', [authorization], (...args) => vacationRequestController.index(...args));
    router.post('/', [authorization], (...args) => vacationRequestController.store(...args));
    router.put('/:id', [authorization], (...args) => vacationRequestController.update(...args));
    router.delete('/:id', [authorization], (...args) => vacationRequestController.delete(...args));

    return router;
};
