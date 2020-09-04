const AbstractRepository = require('./AbstractRepository');
const { User } = require('../models');
const db = require('../models');

class UserRepository extends AbstractRepository {
    get model() {
        return User;
    }

    getAll() {
        return this.model.findAll({
            include: [
                {
                    association: 'roles',
                    attributes: ['name'],
                    where: {
                        name: 'user'
                    }
                }
            ]
        });
    }

    findByEmail(email, options = {}) {
        return this.model.findOne({
            where: {
                email
            },
            ...options
        });
    }

    findByEmailAndContractId(email, contractId) {
        return this.model.findOne({
            where: {
                email
            },
            include: {
                association: 'contracts',
                where: {
                    id: contractId
                }
            }
        });
    }

    findByUserIdAndVacationRequestId(userId, vacationRequetsId) {
        return this.model.findOne({
            where: {
                id: userId
            },
            include: {
                association: 'vacationRequests',
                where: {
                    id: vacationRequetsId
                }
            }
        });
    }

    getByIdWithAssociations(id, options = {}) {
        return this.model.findByPk(id, {
            include: {
                association: 'roles',
                attributes: ['name']
            },

            ...options
        });
    }
}

module.exports = UserRepository;
