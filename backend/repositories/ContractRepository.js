const AbstractRepository = require('./AbstractRepository');
const { Contract } = require('../models');
const { Op } = require('sequelize');
const contract = require('../validators/contract');

class ContractRepository extends AbstractRepository {
    get model() {
        return Contract;
    }

    getAll() {
        return this.model.findAll({
            include: {
                association: 'user',
                attributes: ['name', 'surname', 'email']
            }
        });
    }

    findAllByUserInTimeInterval(startDate, endDate, userId, contractId = null) {
        return this.model.findAll({
            where: {
                userId,
                [Op.not]: {
                    id: contractId
                },
                [Op.or]: {
                    startDate: {
                        [Op.between]: [startDate, endDate]
                    },

                    endDate: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            }
        });
    }
}

module.exports = ContractRepository;
