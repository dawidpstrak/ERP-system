const AbstractRepository = require('./AbstractRepository');
const { VacationRequest } = require('../models');

class VacationRequestRepository extends AbstractRepository {
    get model() {
        return VacationRequest;
    }

    getAllWithUser() {
        return this.model.findAll({
            include: {
                association: 'user',
                attributes: ['email', 'name', 'surname']
            }
        });
    }
}

module.exports = VacationRequestRepository;
