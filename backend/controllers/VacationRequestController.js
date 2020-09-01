const HTTP = require('http-status-codes');

const { VacationRequest } = require('../models');

class VacationRequestController {
    /**
     * @param { VacationRequestRepository } vacationRequestRepository
     * @param { UserRepository } userRepository
     */

    constructor(vacationRequestRepository, userRepository, moment) {
        this.vacationRequestRepository = vacationRequestRepository;
        this.userRepository = userRepository;
        this.moment = moment;
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

            const requestedDaysOff = this.moment.duration(this.moment(endDate).diff(this.moment(startDate))).days();

            let user;

            if (isAdmin) {
                user = await this.userRepository.findByEmail(email);

                if (!user) {
                    return res.status(HTTP.NOT_FOUND).send({ message: 'Not found user with that email' });
                }
            }

            const newVacationRequest = await this.vacationRequestRepository.create({
                ...req.body,
                userId: isAdmin ? user.id : userId,
                status: isAdmin ? status : 'pending',
                requestedDaysOff
            });

            return res.status(HTTP.CREATED).send(newVacationRequest);
        } catch (error) {
            console.error(error);

            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }
    }

    async update(req, res) {
        try {
            const { id, startDate, endDate, status } = req.body;
            const { isAdmin } = req.loggedUser;

            const vacationRequest = await this.vacationRequestRepository.findByPk(id);

            if (!vacationRequest) {
                return res.status(HTTP.NOT_FOUND).send({ message: 'Can not update not exisiting vacation request' });
            }

            const requestedDaysOff = this.moment.duration(this.moment(endDate).diff(this.moment(startDate))).days();

            await vacationRequest.update(
                { ...req.body, status: isAdmin ? status : 'pending', requestedDaysOff },
                { fields: VacationRequest.UPDATABLE_FIELDS }
            );

            const updatedVacationRequest = await this.vacationRequestRepository.findByPk(id);

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
            }

            return res.sendStatus(HTTP.NO_CONTENT);
        } catch (error) {
            console.error(error);

            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = VacationRequestController;
