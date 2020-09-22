const HTTP = require('http-status-codes');
const { expect } = require('chai');

const app = require('../');
const request = require('supertest')(app);
const di = require('../di');

const userRepository = di.get('repositories.user');
const vacationRequestRepository = di.get('repositories.vacationRequest');

const loginAsAdmin = require('./helpers/loginAsAdmin');
const loginAsUser = require('./helpers/loginAsUser');
const truncateDatabase = require('./helpers/truncateDatabase');
const seedDatabase = require('./helpers/seedDatabase');
const vacationRequests = require('../routes/vacationRequests');

let userToken, adminToken, loggedUser, vacationRequest;

beforeAll(async () => {
    await seedDatabase();

    const loginAsUserResponse = await loginAsUser(request);
    const loginAsAdminResponse = await loginAsAdmin(request);

    userToken = loginAsUserResponse.body.token;
    adminToken = loginAsAdminResponse.body.token;
    loggedUser = loginAsUserResponse.body.loggedUser;

    vacationRequest = await vacationRequestRepository.findOne({ where: { userId: loggedUser.id } });
});

afterAll(async () => {
    await truncateDatabase();
});

describe('VacationRequestController', () => {
    describe('GET /vacationRequests', () => {
        it('returns OK and all available vacation requests, sending request AS ADMIN', async () => {
            const response = await request.get('/vacationRequests').set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).to.equal(HTTP.OK);
            expect(response.body).to.be.an('array').that.have.lengthOf(2);
        });

        it("returns OK and all user's vacation requests, sending request AS USER", async () => {
            const response = await request.get('/vacationRequests').set('Authorization', `Bearer ${userToken}`);

            expect(response.status).to.equal(HTTP.OK);
            expect(response.body).to.be.an('array').that.have.lengthOf(1);
            expect(response.body[0]).to.have.property('userId', loggedUser.id);
        });

        it('returns UNAUTHORIZED sending request WITHOUT TOKEN', async () => {
            const response = await request.get('/vacationRequests');

            expect(response.status).to.equal(HTTP.UNAUTHORIZED);
        });
    });

    describe('POST /vacationRequests', () => {
        it("returns CREATED and updating user's days off, sending valid data AS ADMIN", async () => {
            const user = await userRepository.findByPk(loggedUser.id);

            expect(user).to.have.property('availableDaysOffAmount', 0);

            const response = await request.post('/vacationRequests').set('Authorization', `Bearer ${adminToken}`).send({
                userId: user.id,
                status: 'pending',
                startDate: '2020-01-01',
                endDate: '2020-01-03'
            });

            const updatedUser = await userRepository.findByPk(user.id);

            const newVacationRequest = await vacationRequestRepository.findByPk(response.body.id);

            expect(response.status).to.equal(HTTP.CREATED);
            expect(newVacationRequest).to.not.be.null;
            expect(updatedUser).to.have.property('availableDaysOffAmount', -2);
        });

        it("returns CREATED and updating user's days off, sending valid data AS USER", async () => {
            const user = await userRepository.findByPk(loggedUser.id);

            expect(user).to.have.property('availableDaysOffAmount', -2);

            const response = await request.post('/vacationRequests').set('Authorization', `Bearer ${userToken}`).send({
                userId: user.id,
                status: 'pending',
                startDate: '2020-01-01',
                endDate: '2020-01-03'
            });

            const updatedUser = await userRepository.findByPk(user.id);

            const newVacationRequest = await vacationRequestRepository.findByPk(response.body.id);

            expect(response.status).to.equal(HTTP.CREATED);
            expect(newVacationRequest).to.not.be.null;
            expect(updatedUser).to.have.property('availableDaysOffAmount', -4);
        });

        it('returns NOT_FOUND when user does not exist, sending request AS ADMIN', async () => {
            const response = await request.post('/vacationRequests').set('Authorization', `Bearer ${adminToken}`).send({
                userId: 'not-existing-user-id',
                status: 'pending',
                startDate: '2020-01-01',
                endDate: '2020-01-03'
            });

            expect(response.status).to.equal(HTTP.NOT_FOUND);
        });

        it('returns BAD_REQUEST sending empty data AS ADMIN', async () => {
            const response = await request.post('/vacationRequests').set('Authorization', `Bearer ${adminToken}`).send({
                userId: '',
                status: '',
                startDate: '',
                endDate: ''
            });

            const { errors } = response.body;

            expect(response.status).to.equal(HTTP.BAD_REQUEST);
            expect(errors).to.have.lengthOf(7);
            expect(errors).to.deep.equal([
                { message: 'Should not be empty', param: 'userId' },
                { message: 'Should not be empty', param: 'status' },
                { message: 'Should not be empty', param: 'startDate' },
                { message: 'Invalid date format', param: 'startDate' },
                { message: 'Should not be empty', param: 'endDate' },
                { message: 'Invalid date format', param: 'endDate' },
                { message: 'end date must be after start date', param: 'endDate' }
            ]);
        });

        it('returns BAD_REQUEST sending empty data AS USER', async () => {
            const response = await request.post('/vacationRequests').set('Authorization', `Bearer ${userToken}`).send({
                status: '',
                startDate: '',
                endDate: ''
            });

            const { errors } = response.body;

            expect(response.status).to.equal(HTTP.BAD_REQUEST);
            expect(errors).to.have.lengthOf(6);
            expect(errors).to.deep.equal([
                { message: 'Should not be empty', param: 'status' },
                { message: 'Should not be empty', param: 'startDate' },
                { message: 'Invalid date format', param: 'startDate' },
                { message: 'Should not be empty', param: 'endDate' },
                { message: 'Invalid date format', param: 'endDate' },
                { message: 'end date must be after start date', param: 'endDate' }
            ]);
        });

        it('returns UNAUTHORIZED sending request WITHOUT TOKEN', async () => {
            const response = await request.post('/vacationRequests');

            expect(response.status).to.equal(HTTP.UNAUTHORIZED);
        });
    });

    describe('PUT /vacationRequests/:id', () => {
        it('returns OK, changing owner of vacation request AS ADMIN (days off in both users should be updated)', async () => {
            const firstUser = await userRepository.findByEmail('user@erpsystem.test');
            const secondUser = await userRepository.findByEmail('user2@erpsystem.test');

            expect(firstUser).to.have.property('availableDaysOffAmount', -4);
            expect(secondUser).to.have.property('availableDaysOffAmount', 0);

            const response = await request
                .put('/vacationRequests/' + vacationRequest.id)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    userId: secondUser.id,
                    status: 'active',
                    startDate: '2020-01-01',
                    endDate: '2020-01-03'
                });

            const firstUpdatedUser = await userRepository.findByPk(firstUser.id);
            const secondUpdatedUser = await userRepository.findByPk(secondUser.id);

            expect(response.status).to.equal(HTTP.OK);
            expect(firstUpdatedUser).to.have.property('availableDaysOffAmount', -2);
            expect(secondUpdatedUser).to.have.property('availableDaysOffAmount', -2);
            expect(response.body).to.have.property('userId', secondUser.id);
        });

        it("returns OK, updating vacation request and it's owner days off AS USER", async () => {
            vacationRequest = await vacationRequestRepository.findByPk(vacationRequest.id);

            expect(vacationRequest).to.have.property('requestedDaysOff', 2);

            const vacationRequestOwner = await userRepository.findByPk(vacationRequest.userId);

            expect(vacationRequestOwner).to.have.property('availableDaysOffAmount', -2);

            const response = await request
                .put('/vacationRequests/' + vacationRequest.id)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    userId: vacationRequest.userId,
                    status: 'pending',
                    startDate: '2020-01-01',
                    endDate: '2020-01-04'
                });

            const updatedVacationRequestOwner = await userRepository.findByPk(vacationRequest.userId);
            const updatedVacationRequest = await vacationRequestRepository.findByPk(vacationRequest.id);

            expect(response.status).to.equal(HTTP.OK);
            expect(updatedVacationRequestOwner).to.have.property('availableDaysOffAmount', -3);
            expect(response.body).to.include({
                startDate: '2020-01-01',
                endDate: '2020-01-04',
                status: 'pending',
                requestedDaysOff: 3
            });
            expect(updatedVacationRequest).to.have.property('requestedDaysOff', 3);
        });

        it('returns NOT_FOUND when user does not exist, sending request AS ADMIN', async () => {
            const response = await request
                .put('/vacationRequests/' + vacationRequest.id)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    userId: 'not-existing-user-id',
                    status: 'pending',
                    startDate: '2020-01-01',
                    endDate: '2020-01-03'
                });

            expect(response.status).to.equal(HTTP.NOT_FOUND);
        });

        it('returns NOT_FOUND when user does not exist, sending request AS USER', async () => {
            const response = await request
                .put('/vacationRequests/' + vacationRequest.id)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    userId: 'not-existing-user-id',
                    status: 'pending',
                    startDate: '2020-01-01',
                    endDate: '2020-01-03'
                });

            expect(response.status).to.equal(HTTP.NOT_FOUND);
        });

        it('returns NOT_FOUND when vacation request does not exist, sending request AS ADMIN', async () => {
            const response = await request
                .put('/vacationRequests/' + 'not-existing-vacationRequest-id')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    id: 'not-existing-vacationRequest-id',
                    userId: loggedUser.id,
                    status: 'pending',
                    startDate: '2020-01-01',
                    endDate: '2020-01-03'
                });

            expect(response.status).to.equal(HTTP.NOT_FOUND);
        });

        it('returns NOT_FOUND when vacation request does not exist, sending request AS USER', async () => {
            const response = await request
                .put('/vacationRequests/' + 'not-existing-vacationRequest-id')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    id: 'not-existing-vacationRequest-id',
                    userId: loggedUser.id,
                    status: 'pending',
                    startDate: '2020-01-01',
                    endDate: '2020-01-03'
                });

            expect(response.status).to.equal(HTTP.NOT_FOUND);
        });

        it('returns BAD_REQUEST sending empty data AS ADMIN', async () => {
            const response = await request
                .put('/vacationRequests/' + vacationRequest.id)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    userId: '',
                    status: '',
                    startDate: '',
                    endDate: ''
                });

            const { errors } = response.body;

            expect(response.status).to.equal(HTTP.BAD_REQUEST);
            expect(errors).to.have.lengthOf(7);
            expect(errors).to.deep.equal([
                { message: 'Should not be empty', param: 'userId' },
                { message: 'Should not be empty', param: 'status' },
                { message: 'Should not be empty', param: 'startDate' },
                { message: 'Invalid date format', param: 'startDate' },
                { message: 'Should not be empty', param: 'endDate' },
                { message: 'Invalid date format', param: 'endDate' },
                { message: 'end date must be after start date', param: 'endDate' }
            ]);
        });

        it('returns BAD_REQUEST sending empty data AS USER', async () => {
            const response = await request
                .put('/vacationRequests/' + vacationRequest.id)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    status: '',
                    startDate: '',
                    endDate: ''
                });

            const { errors } = response.body;

            expect(response.status).to.equal(HTTP.BAD_REQUEST);
            expect(errors).to.have.lengthOf(6);
            expect(errors).to.deep.equal([
                { message: 'Should not be empty', param: 'status' },
                { message: 'Should not be empty', param: 'startDate' },
                { message: 'Invalid date format', param: 'startDate' },
                { message: 'Should not be empty', param: 'endDate' },
                { message: 'Invalid date format', param: 'endDate' },
                { message: 'end date must be after start date', param: 'endDate' }
            ]);
        });

        it('returns FORBIDDEN sending request with status not equal to pending AS USER', async () => {
            const response = await request
                .put('/vacationRequests/' + vacationRequest.id)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    status: 'active',
                    startDate: '2020-01-01',
                    endDate: '2020-01-03'
                });

            expect(response.status).to.equal(HTTP.FORBIDDEN);
        });

        it('returns FORBIDDEN when vacation request changing owner, sending request AS USER', async () => {
            const response = await request
                .put('/vacationRequests/' + vacationRequest.id)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    userId: 'newUserId',
                    status: 'active',
                    startDate: '2020-01-01',
                    endDate: '2020-01-03'
                });

            expect(response.status).to.equal(HTTP.FORBIDDEN);
        });

        it('returns UNAUTHORIZED sending request WITHOUT TOKEN', async () => {
            const response = await request.put('/vacationRequests/id');

            expect(response.status).to.equal(HTTP.UNAUTHORIZED);
        });
    });

    describe('DELETE /vacationRequests/:id', () => {
        it("returns NO_CONTENT, successfully deleting vacation request and updating user's days off AS ADMIN", async () => {
            vacationRequest = await vacationRequestRepository.findByPk(vacationRequest.id);

            const user = await userRepository.findByPk(vacationRequest.userId);

            expect(user.availableDaysOffAmount).to.equal(-3);

            const response = await request
                .delete('/vacationRequests/' + vacationRequest.id)
                .set('Authorization', `Bearer ${adminToken}`);

            const updatedUser = await userRepository.findByPk(vacationRequest.userId);
            const deletedVacationRequest = await vacationRequestRepository.findByPk(vacationRequest.id);

            expect(response.status).to.equal(HTTP.NO_CONTENT);
            expect(updatedUser.availableDaysOffAmount).to.equal(0);
            expect(deletedVacationRequest).to.be.null;
        });

        it('returns NO_CONTENT sending request with non existing vacation request id AS ADMIN', async () => {
            const response = await request
                .delete('/vacationRequests/' + 'not-existing-vacationRequest-id')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).to.equal(HTTP.NO_CONTENT);
        });

        it('returns FORBIDDEN sending delete active contract request AS USER', async () => {
            vacationRequest = await vacationRequestRepository.create({
                userId: loggedUser.id,
                startDate: '2020-01-01',
                endDate: '2020-01-03',
                status: 'active',
                requestedDaysOff: 2
            });

            const response = await request
                .delete('/vacationRequests/' + vacationRequest.id)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).to.equal(HTTP.FORBIDDEN);
        });

        it('returns UNAUTHORIZED sending request WITHOUT TOKEN', async () => {
            const response = await request.delete('/vacationRequests/' + vacationRequest.id);

            expect(response.status).to.equal(HTTP.UNAUTHORIZED);
        });
    });
});
