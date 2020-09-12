const AbstractRepository = require('./AbstractRepository');
const { User } = require('../models');
const db = require('../models');

class UserRepository extends AbstractRepository {
    get model() {
        return User;
    }

    getAll(where) {
        return this.model.findAll({
            ...where,
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
