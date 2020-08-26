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
                },
                {
                    association: 'contracts',
                    attributes: [[db.sequelize.fn('sum', db.sequelize.col('availableDaysOff')), 'totalDaysOff']]
                }
            ],
            group: 'id'
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
