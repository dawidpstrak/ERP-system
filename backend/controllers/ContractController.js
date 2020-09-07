const HTTP = require('http-status-codes');
const { Contract } = require('../models');

class ContractController {
    /**
     * @param { ContractRepository } contractRepository
     * @param { UserRepository } userRepository
     * @param { UserDaysOffAmountCalculator } userDaysOffAmountCalculator
     */

    constructor(userRepository, contractRepository, userDaysOffAmountCalculator) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
        this.userDaysOffAmountCalculator = userDaysOffAmountCalculator;
    }

    async index(req, res) {
        try {
            const { isAdmin, id } = req.loggedUser;

            let contracts;

            if (isAdmin) {
                contracts = await this.contractRepository.getAll();
            } else {
                contracts = await this.contractRepository.getAllByUser(id);
            }

            return res.send(contracts);
        } catch (error) {
            console.error(error);

            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }
    }

    async store(req, res) {
        try {
            const { email, availableDaysOffAmount } = req.body;

            const user = await this.userRepository.findByEmail(email, ['id']);

            const contract = await this.contractRepository.create({
                userId: user.id,
                ...req.body
            });

            await this.userDaysOffAmountCalculator.onContractStore(user, availableDaysOffAmount);

            return res.status(HTTP.CREATED).send(contract);
        } catch (error) {
            console.error(error);

            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }
    }

    async update(req, res) {
        try {
            const { id: contractId, email, availableDaysOffAmount: actualAvailableDaysOffAmount } = req.body;

            const contract = await this.contractRepository.findByPk(contractId);

            if (!contract) {
                return res.status(HTTP.NOT_FOUND);
            }

            const user = await this.userRepository.findByEmailAndContractId(email, contractId);

            if (!user) {
                return res.status(HTTP.NOT_FOUND).send({ message: 'This contract belongs to other user' });
            }

            const previousAvailableDaysOffAmount = contract.availableDaysOffAmount;

            await contract.update(req.body, { fields: Contract.UPDATABLE_FIELDS });

            await this.userDaysOffAmountCalculator.onContractUpdate(
                user,
                previousAvailableDaysOffAmount,
                actualAvailableDaysOffAmount
            );

            const updatedContract = await this.contractRepository.findByPk(contractId);

            return res.send(updatedContract);
        } catch (error) {
            console.error(error);

            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const contract = await this.contractRepository.findByPk(id);

            if (contract) {
                await contract.destroy();

                await this.userDaysOffAmountCalculator.onContractDelete(
                    contract.userId,
                    contract.availableDaysOffAmount
                );
            }

            return res.sendStatus(HTTP.NO_CONTENT);
        } catch (error) {
            console.error(error);

            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = ContractController;
