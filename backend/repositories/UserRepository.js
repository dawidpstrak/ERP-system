const AbstractRepository = require('./AbstractRepository');
const { User } = require('../models');

class UserRepository extends AbstractRepository {
    get model() {
        return User;
    }

    async getAll() {
        return await this.model.findAll({
            include: {
                association: 'roles',
                attributes: ['name'],
                where: {
                    name: 'user'
                }
            }
        });
    }

    async findByEmail(email, options = {}) {
        return await this.model.findOne({
            where: {
                email
            },
            ...options
        });
    }

    async getByIdWithAssociation(id, options = {}) {
        return await this.model.findByPk(id, {
            include: {
                association: 'roles',
                attributes: ['name']
            },
            ...options
        });
    }
}

module.exports = UserRepository;
