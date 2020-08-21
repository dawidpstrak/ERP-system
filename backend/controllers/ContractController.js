const HTTP = require('http-status-codes');

const { Contract } = require('../models');

class ContractController {
    /**
     * @param { ContractRepository } contractRepository
     * @param { UserRepository } userRepository
     */

    constructor(userRepository, contractRepository) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
    }

    async index(req, res) {
        try {
            const contracts = await this.contractRepository.getAll();

            return res.send(contracts);
        } catch (error) {
            console.error(error);

            return res.status(HTTP.INTERNAL_SERVER_ERROR);
        }
    }

    async store(req, res) {
        try {
            const { email } = req.body;

            const user = await this.userRepository.findByEmail(email, ['id']);

            if (!user) {
                return res.status(HTTP.NOT_FOUND).send({ message: 'Not found user with that email' });
            }

            const contract = await this.contractRepository.create({
                userId: user.id,
                ...req.body
            });

            return res.status(HTTP.CREATED).send(contract);
        } catch (error) {
            console.error(error);

            return res.status(HTTP.INTERNAL_SERVER_ERROR);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.body;

            const contract = await this.contractRepository.findByPk(id);

            if (!contract) {
                return res.status(HTTP.NOT_FOUND);
            }

            await contract.update(req.body, { fields: Contract.UPDATABLE_FIELDS });

            const updatedContract = await this.contractRepository.findByPk(id);

            return res.send(updatedContract);
        } catch (error) {
            console.error(error);

            return res.status(HTTP.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const contract = await this.contractRepository.findByPk(id);

            if (!contract) {
                return res.status(HTTP.NO_CONTENT);
            }

            await contract.destroy();

            return res.sendStatus(HTTP.NO_CONTENT);
        } catch (error) {
            console.error(error);

            return res.status(HTTP.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = ContractController;
