const AbstractRepository = require('./AbstractRepository');
const { Role } = require('../models');
const { Op } = require('sequelize');

class RoleRepository extends AbstractRepository {
    get model() {
        return Role;
    }

    getByNames(roles) {
        return this.model.findAll({
            where: {
                name: {
                    [Op.in]: roles.map(role => role.name)
                }
            }
        });
    }
}

module.exports = RoleRepository;
