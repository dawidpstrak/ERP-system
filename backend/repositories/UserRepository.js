const AbstractRepository = require('./AbstractRepository');
const { User } = require('../models');

class UserRepository extends AbstractRepository {
    get model() {
        return User;
    }

    getAll() {
        return this.model.findAll({
            include: {
                association: 'roles',
                attributes: ['name'],
                where: {
                    name: 'user'
                }
            }
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

    getByIdWithAssociation(id, options = {}) {
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
