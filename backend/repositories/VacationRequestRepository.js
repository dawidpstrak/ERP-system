const AbstractRepository = require('./AbstractRepository');
const { VacationRequest } = require('../models');

class VacationRequestRepository extends AbstractRepository {
    get model() {
        return VacationRequest;
    }

    findOneById(id, options) {
        return this.model.findOne({
            where: {
                id
            },
            include: {
                association: 'user',
                attributes: ['firstName', 'lastName']
            }
        });
    }

    getAllWithUser() {
        return this.model.findAll({
            include: {
                association: 'user',
                attributes: ['email', 'firstName', 'lastName']
            }
        });
    }
}

module.exports = VacationRequestRepository;
