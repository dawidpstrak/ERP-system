const HTTP = require('http-status-codes');
const { Contract } = require('../models');

class ContractController {
    /**
     * @param { ContractRepository } contractRepository
     * @param { UserRepository } userRepository
     * @param { UserDaysOffAmountCalculator } userDaysOffAmountCalculator
     * @param { ContractsOverlapHandler } contractsOverlapHandler
     * @param { ContractCalculator } contractCalculator
     */

    constructor(
        userRepository,
        contractRepository,
        userDaysOffAmountCalculator,
        contractsOverlapHandler,
        contractCalculator
    ) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
        this.userDaysOffAmountCalculator = userDaysOffAmountCalculator;
        this.contractsOverlapHandler = contractsOverlapHandler;
        this.contractCalculator = contractCalculator;
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
            const { userId, startDate, duration, vacationsPerYear } = req.body;
            const endDate = this.contractCalculator.endDate(startDate, duration);
            const contractDaysOffAmount = this.contractCalculator.daysOffAmount(vacationsPerYear, duration);

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
                ...req.body,
                userId: user.id,
                availableDaysOffAmount: contractDaysOffAmount,
                endDate
            });

            await this.userDaysOffAmountCalculator.onContractStore(user, contractDaysOffAmount);

            const newContract = await this.contractRepository.findOneById(contract.id);

            return res.status(HTTP.CREATED).send(newContract);
        } catch (error) {
            console.error(error);

            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }
    }

    async update(req, res) {
        try {
            const { id: contractId } = req.params;
            const { userId, startDate, duration, vacationsPerYear } = req.body;
            const endDate = this.contractCalculator.endDate(startDate, duration);
            const actualAvailableDaysOffAmount = this.contractCalculator.daysOffAmount(vacationsPerYear, duration);

            const contract = await this.contractRepository.findByPk(contractId);

            if (!contract) {
                return res.sendStatus(HTTP.NOT_FOUND);
            }

            const previousAvailableDaysOffAmount = contract.availableDaysOffAmount;

            const user = await this.userRepository.findByPk(userId);

            if (!user) {
                return res.status(HTTP.NOT_FOUND).send({ message: 'User not exist' });
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

            if (userId !== contract.userId) {
                await this.userDaysOffAmountCalculator.onContractChangeOwner(
                    contract.userId,
                    user,
                    previousAvailableDaysOffAmount,
                    contract
                );
            }

            await contract.update(
                { ...req.body, availableDaysOffAmount: actualAvailableDaysOffAmount, endDate },
                { fields: Contract.UPDATABLE_FIELDS }
            );

            await this.userDaysOffAmountCalculator.onContractUpdate(
                user,
                previousAvailableDaysOffAmount,
                actualAvailableDaysOffAmount
            );

            const updatedContract = await this.contractRepository.findOneById(contractId);

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
