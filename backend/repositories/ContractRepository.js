const AbstractRepository = require('./AbstractRepository');
const { Contract } = require('../models');
const { Op } = require('sequelize');

class ContractRepository extends AbstractRepository {
    get model() {
        return Contract;
    }

    getAll(options = {}) {
        return this.model.findAll({
            include: {
                association: 'user',
                attributes: ['firstName', 'lastName']
            },
            ...options
        });
    }

    findAllByUserInTimeInterval(newContractStartDate, newContractEndDate, userId, contractId) {
        return this.model.findAll({
            where: {
                userId,
                [Op.not]: {
                    id: contractId
                },
                [Op.or]: {
                    startDate: {
                        [Op.between]: [newContractStartDate, newContractEndDate]
                    },

                    endDate: {
                        [Op.between]: [newContractStartDate, newContractEndDate]
                    },
                    [Op.and]: {
                        startDate: {
                            [Op.lte]: newContractStartDate
                        },
                        endDate: {
                            [Op.gte]: newContractEndDate
                        }
                    }
                }
            }
        });
    }
}

module.exports = ContractRepository;
