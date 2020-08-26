const AbstractRepository = require('./AbstractRepository');
const { VacationRequest } = require('../models');
const { Op } = require('sequelize');

class VacationRequestRepository extends AbstractRepository {
    get model() {
        return VacationRequest;
    }
}

module.exports = VacationRequestRepository;
