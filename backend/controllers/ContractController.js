const HTTP = require('http-status-codes');
const { Contract } = require('../models');

class ContractController {
    /**
     * @param { ContractRepository } contractRepository
     * @param { UserRepository } userRepository
     * @param { UserDaysOffAmountCalculator } userDaysOffAmountCalculator
     * @param { ContractsOverlapHandler } contractsOverlapHandler
     */

    constructor(userRepository, contractRepository, userDaysOffAmountCalculator, contractsOverlapHandler) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
        this.userDaysOffAmountCalculator = userDaysOffAmountCalculator;
        this.contractsOverlapHandler = contractsOverlapHandler;
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
            const { userId, startDate, endDate, availableDaysOffAmount } = req.body;

            const user = await this.userRepository.findByPk(userId);

            if (!user) {
                return res.status(HTTP.NOT_FOUND).send({ message: 'User not exist' });
            }

            const contractOverlaping = await this.contractsOverlapHandler.isAnyContractOverlaping(
                startDate,
                endDate,
                userId
            );

            if (contractOverlaping) {
                return res
                    .status(HTTP.UNPROCESSABLE_ENTITY)
                    .send({ title: 'Cannot create contract', message: 'There is exisiting contract in this time' });
            }

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
            const {
                id: contractId,
                userId,
                startDate,
                endDate,
                availableDaysOffAmount: actualAvailableDaysOffAmount
            } = req.body;

            const contract = await this.contractRepository.findByPk(contractId);

            if (!contract) {
                return res.status(HTTP.NOT_FOUND);
            }

            const user = await this.userRepository.findByPk(userId);

            if (!user) {
                return res.status(HTTP.NOT_FOUND).send({ message: 'User not exist' });
            }

            const previousAvailableDaysOffAmount = contract.availableDaysOffAmount;

            if (userId !== contract.userId) {
                await this.userDaysOffAmountCalculator.onContractChangeOwner(
                    contract.userId,
                    user,
                    previousAvailableDaysOffAmount,
                    contract
                );
            }

            const contractOverlaping = await this.contractsOverlapHandler.isAnyContractOverlaping(
                startDate,
                endDate,
                user.id,
                contractId
            );

            if (contractOverlaping) {
                return res
                    .status(HTTP.UNPROCESSABLE_ENTITY)
                    .send({ title: 'Cannot update contract', message: 'There is exisiting contract in this time' });
            }

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
