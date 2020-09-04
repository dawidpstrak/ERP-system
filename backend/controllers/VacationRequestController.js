const HTTP = require('http-status-codes');

const { VacationRequest } = require('../models');

class VacationRequestController {
    /**
     * @param { VacationRequestRepository } vacationRequestRepository
     * @param { UserRepository } userRepository
     * @param { UserDaysOffAmountCalculator } userDaysOffAmountCalculator
     */

    constructor(vacationRequestRepository, userRepository, moment, userDaysOffAmountCalculator) {
        this.vacationRequestRepository = vacationRequestRepository;
        this.userRepository = userRepository;
        this.moment = moment;
        this.userDaysOffAmountCalculator = userDaysOffAmountCalculator;
    }

    async index(req, res) {
        try {
            const { id, isAdmin } = req.loggedUser;

            let vacationRequests;

            if (isAdmin) {
                vacationRequests = await this.vacationRequestRepository.getAllWithUser();
            } else {
                vacationRequests = await this.vacationRequestRepository.getAllByUser(id);
            }

            return res.send(vacationRequests);
        } catch (error) {
            console.error(error);

            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }
    }

    async store(req, res) {
        try {
            const { startDate, endDate, email, status } = req.body;
            const { id: userId, isAdmin } = req.loggedUser;

            let user;

            if (isAdmin) {
                user = await this.userRepository.findByEmail(email);
            } else {
                user = await this.userRepository.findByPk(userId);
            }

            if (!user) {
                return res.status(HTTP.NOT_FOUND).send({ message: 'Can not find this user' });
            }

            const requestedDaysOff = this.moment.duration(this.moment(endDate).diff(this.moment(startDate))).days();

            const newVacationRequest = await this.vacationRequestRepository.create({
                ...req.body,
                userId: isAdmin ? user.id : userId,
                status: isAdmin ? status : VacationRequest.PENDING,
                requestedDaysOff
            });

            await this.userDaysOffAmountCalculator.onVacationRequestStore(user, requestedDaysOff);

            return res.status(HTTP.CREATED).send(newVacationRequest);
        } catch (error) {
            console.error(error);

            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }
    }

    async update(req, res) {
        try {
            const { id: vacationRequestId, userId, startDate, endDate, status } = req.body;
            const { isAdmin } = req.loggedUser;

            if (!isAdmin && status !== VacationRequest.PENDING) {
                return res.sendStatus(HTTP.FORBIDDEN);
            }

            const user = await this.userRepository.findByUserIdAndVacationRequestId(userId, vacationRequestId);

            if (!user) {
                return res.status(HTTP.NOT_FOUND).send({ message: 'Vacation request belongs to other user' });
            }

            const vacationRequest = await this.vacationRequestRepository.findByPk(vacationRequestId);

            if (!vacationRequest) {
                return res.status(HTTP.NOT_FOUND);
            }

            const previousRequestedDaysOff = vacationRequest.requestedDaysOff;

            const actualRequestedDaysOff = this.moment
                .duration(this.moment(endDate).diff(this.moment(startDate)))
                .days();

            await vacationRequest.update(
                {
                    ...req.body,
                    status: isAdmin ? status : VacationRequest.PENDING,
                    requestedDaysOff: actualRequestedDaysOff
                },

                { fields: VacationRequest.UPDATABLE_FIELDS }
            );

            await this.userDaysOffAmountCalculator.onVacationRequestUpdate(
                user,
                previousRequestedDaysOff,
                actualRequestedDaysOff
            );

            const updatedVacationRequest = await this.vacationRequestRepository.findByPk(vacationRequestId);

            return res.send(updatedVacationRequest);
        } catch (error) {
            console.error(error);

            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const vacationRequest = await this.vacationRequestRepository.findByPk(id);

            if (vacationRequest) {
                await vacationRequest.destroy();

                await this.userDaysOffAmountCalculator.onVacationRequestDelete(
                    vacationRequest.userId,
                    vacationRequest.requestedDaysOff
                );
            }

            return res.sendStatus(HTTP.NO_CONTENT);
        } catch (error) {
            console.error(error);

            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = VacationRequestController;