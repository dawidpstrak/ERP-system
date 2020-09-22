const HTTP = require('http-status-codes');
const { expect } = require('chai');

const app = require('../');
const request = require('supertest')(app);
const di = require('../di');

const userRepository = di.get('repositories.user');
const contractRepository = di.get('repositories.contract');

const loginAsAdmin = require('./helpers/loginAsAdmin');
const loginAsUser = require('./helpers/loginAsUser');
const truncateDatabase = require('./helpers/truncateDatabase');
const seedDatabase = require('./helpers/seedDatabase');

let userToken, adminToken, loggedUser, contract;

beforeAll(async () => {
    await seedDatabase();

    const loginAsUserResponse = await loginAsUser(request);
    const loginAsAdminResponse = await loginAsAdmin(request);

    userToken = loginAsUserResponse.body.token;
    adminToken = loginAsAdminResponse.body.token;
    loggedUser = loginAsUserResponse.body.loggedUser;

    contract = await contractRepository.findOne({ where: { userId: loggedUser.id } });
});

afterAll(async () => {
    await truncateDatabase();
});

describe('ContractController', () => {
    describe('GET /contracts', () => {
        it('returns OK and all available contracts, requesting AS ADMIN', async () => {
            const response = await request.get('/contracts').set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).to.equal(HTTP.OK);
            expect(response.body).to.be.an('array').that.have.lengthOf(2);
        });

        it("returns OK with all user's contracts, requesting AS USER", async () => {
            const response = await request.get('/contracts').set('Authorization', `Bearer ${userToken}`);

            expect(response.status).to.equal(HTTP.OK);
            expect(response.body).to.be.an('array').that.have.lengthOf(1);
            expect(response.body[0]).to.have.property('userId', loggedUser.id);
        });

        it('returns UNAUTHORIZED sending request WITHOUT TOKEN', async () => {
            const response = await request.get('/contracts');

            expect(response.status).to.equal(HTTP.UNAUTHORIZED);
        });
    });

    describe('POST /contracts', () => {
        it("returns CREATED and updating user's days off, sending valid data AS ADMIN", async () => {
            const user = await userRepository.findByPk(loggedUser.id);

            expect(user).to.have.property('availableDaysOffAmount', 0);

            const response = await request.post('/contracts').set('Authorization', `Bearer ${adminToken}`).send({
                userId: loggedUser.id,
                startDate: '2020-05-02',
                endDate: '2020-06-01',
                duration: 1,
                vacationsPerYear: 20,
                availableDaysOffAmount: 2
            });

            const updatedUser = await userRepository.findByPk(loggedUser.id);

            const newContract = await contractRepository.findByPk(response.body.id);

            expect(response.status).to.equal(HTTP.CREATED);
            expect(newContract).to.not.be.null;
            expect(updatedUser).to.have.property('availableDaysOffAmount', 2);
        });

        it('returns NOT_FOUND, sending request with non existing userId AS ADMIN', async () => {
            const response = await request.post('/contracts').set('Authorization', `Bearer ${adminToken}`).send({
                userId: 'wrong-id',
                startDate: '2020-03-02',
                endDate: '2020-04-01',
                duration: 1,
                vacationsPerYear: 20,
                availableDaysOffAmount: 2
            });

            expect(response.status).to.equal(HTTP.NOT_FOUND);
        });

        it('returns BAD_REQUEST sending invalid data (empty) AS ADMIN', async () => {
            const response = await request.post('/contracts').set('Authorization', `Bearer ${adminToken}`).send({
                userId: '',
                startDate: '',
                endDate: '',
                duration: '',
                vacationsPerYear: '',
                availableDaysOff: ''
            });

            const { errors } = response.body;

            expect(response.status).to.equal(HTTP.BAD_REQUEST);
            expect(errors).to.have.lengthOf(7);
            expect(errors).to.deep.equal([
                { message: 'Should not be empty', param: 'userId' },
                { message: 'Should not be empty', param: 'startDate' },
                { message: 'Invalid date format', param: 'startDate' },
                { message: 'Should not be empty', param: 'duration' },
                { message: 'Should be integer type', param: 'duration' },
                { message: 'Should not be empty', param: 'vacationsPerYear' },
                { message: 'Should be integer type', param: 'vacationsPerYear' }
            ]);
        });

        it('returns UNPROCESSABLE_ENTITY when new contract will overlap existing contract, requesting AS ADMIN', async () => {
            const response = await request.post('/contracts').set('Authorization', `Bearer ${adminToken}`).send({
                userId: loggedUser.id,
                startDate: '2020-01-02',
                endDate: '2020-02-01',
                duration: 1,
                vacationsPerYear: 20,
                availableDaysOffAmount: 2
            });

            expect(response.status).to.equal(HTTP.UNPROCESSABLE_ENTITY);
            expect(response.body).to.deep.equal({
                title: 'Cannot create contract',
                message: 'There is exisiting contract in this time'
            });
        });

        it('returns FORBIDDEN sending request AS USER', async () => {
            const response = await request.post('/contracts').set('Authorization', `Bearer ${userToken}`);

            expect(response.status).to.equal(HTTP.FORBIDDEN);
        });

        it('returns UNAUTHORIZED sending request WITHOUT TOKEN', async () => {
            const response = await request.post('/contracts');

            expect(response.status).to.equal(HTTP.UNAUTHORIZED);
        });
    });

    describe('PUT /contracts/:id', () => {
        it("returns OK, updating contract and user's days off AS ADMIN", async () => {
            const user = await userRepository.findByPk(loggedUser.id);

            expect(user).to.have.property('availableDaysOffAmount', 2);

            const response = await request
                .put('/contracts/' + contract.id)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    id: contract.id,
                    userId: loggedUser.id,
                    startDate: '2020-01-02',
                    endDate: '2020-04-01',
                    duration: 3,
                    vacationsPerYear: 20,
                    availableDaysOffAmount: 5
                });

            const updatedUser = await userRepository.findByPk(loggedUser.id);

            expect(response.status).to.equal(HTTP.OK);
            expect(response.body).to.include({
                id: contract.id,
                userId: loggedUser.id,
                startDate: '2020-01-02',
                endDate: '2020-04-01',
                duration: 3,
                status: 'active',
                vacationsPerYear: 20,
                availableDaysOffAmount: 5
            });
            expect(updatedUser).to.have.property('availableDaysOffAmount', 5);
        });

        it('returns OK, changing owner of contract AS ADMIN (days off in both users should be updated)', async () => {
            const firstUser = await userRepository.findByEmail('user@erpsystem.test');
            const secondUser = await userRepository.findByEmail('user2@erpsystem.test');

            expect(firstUser).to.have.property('availableDaysOffAmount', 5);
            expect(secondUser).to.have.property('availableDaysOffAmount', 0);

            const response = await request
                .put('/contracts/' + contract.id)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    id: contract.id,
                    userId: secondUser.id,
                    startDate: '2020-03-02',
                    endDate: '2020-06-01',
                    duration: 3,
                    vacationsPerYear: 20,
                    availableDaysOffAmount: 5
                });

            const firstUpdatedUser = await userRepository.findByPk(firstUser.id);
            const secondUpdatedUser = await userRepository.findByPk(secondUser.id);

            expect(response.status).to.equal(HTTP.OK);
            expect(firstUpdatedUser).to.have.property('availableDaysOffAmount', 0);
            expect(secondUpdatedUser).to.have.property('availableDaysOffAmount', 5);
            expect(response.body).to.have.property('userId', secondUser.id);
        });

        it('returns NOT_FOUND when user does not exist, sending request AS ADMIN', async () => {
            const response = await request
                .put('/contracts/' + contract.id)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    id: contract.id,
                    userId: 'not-existing-user-id',
                    startDate: '2020-01-02',
                    endDate: '2020-02-01',
                    duration: 1,
                    vacationsPerYear: 20,
                    availableDaysOffAmount: 2
                });

            expect(response.status).to.equal(HTTP.NOT_FOUND);
        });

        it('returns NOT_FOUND requesting update not existing contract AS ADMIN', async () => {
            const response = await request
                .put('/contracts/' + 'not-existing-contract-id')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    id: 'not-existing-contract-id',
                    userId: loggedUser.id,
                    startDate: '2020-01-02',
                    endDate: '2020-02-01',
                    duration: 1,
                    vacationsPerYear: 20,
                    availableDaysOffAmount: 2
                });

            expect(response.status).to.equal(HTTP.NOT_FOUND);
        });

        it('returns BAD_REQUEST sending empty data AS ADMIN', async () => {
            const response = await request
                .put('/contracts/' + contract.id)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    userId: '',
                    startDate: '',
                    endDate: '',
                    duration: '',
                    vacationsPerYear: '',
                    availableDaysOff: ''
                });

            const { errors } = response.body;

            expect(response.status).to.equal(HTTP.BAD_REQUEST);
            expect(errors).to.have.lengthOf(7);
            expect(errors).to.deep.equal([
                { message: 'Should not be empty', param: 'userId' },
                { message: 'Should not be empty', param: 'startDate' },
                { message: 'Invalid date format', param: 'startDate' },
                { message: 'Should not be empty', param: 'duration' },
                { message: 'Should be integer type', param: 'duration' },
                { message: 'Should not be empty', param: 'vacationsPerYear' },
                { message: 'Should be integer type', param: 'vacationsPerYear' }
            ]);
        });

        it('returns UNPROCESSABLE_ENTITY when contract after update will overlap another, existing contract AS ADMIN', async () => {
            const response = await request
                .put('/contracts/' + contract.id)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    id: contract.id,
                    userId: loggedUser.id,
                    startDate: '2020-01-02',
                    endDate: '2020-07-01',
                    duration: 6,
                    vacationsPerYear: 20,
                    availableDaysOffAmount: 10
                });

            expect(response.status).to.equal(HTTP.UNPROCESSABLE_ENTITY);
            expect(response.body).to.deep.equal({
                title: 'Cannot update contract',
                message: 'There is exisiting contract in this time'
            });
        });

        it('returns FORBIDDEN sending request AS USER', async () => {
            const response = await request.put('/contracts/' + contract.id).set('Authorization', `Bearer ${userToken}`);

            expect(response.status).to.equal(HTTP.FORBIDDEN);
        });

        it('returns UNAUTHORIZED sending request WITHOUT TOKEN', async () => {
            const response = await request.put('/contracts/' + contract.id);

            expect(response.status).to.equal(HTTP.UNAUTHORIZED);
        });
    });

    describe('DELETE /contracts/:id', () => {
        it("returns NO_CONTENT, successfully deleting contract and updating user's days off AS ADMIN", async () => {
            contract = await contractRepository.findByPk(contract.id);

            const user = await userRepository.findByPk(contract.userId);

            expect(user.availableDaysOffAmount).to.equal(5);

            const response = await request
                .delete('/contracts/' + contract.id)
                .set('Authorization', `Bearer ${adminToken}`);

            const updatedUser = await userRepository.findByPk(contract.userId);
            const deletedContract = await contractRepository.findByPk(contract.id);

            expect(response.status).to.equal(HTTP.NO_CONTENT);
            expect(updatedUser.availableDaysOffAmount).to.equal(0);
            expect(deletedContract).to.be.null;
        });

        it('returns NO_CONTENT requesting delete contract AS ADMIN', async () => {
            const response = await request
                .delete('/contracts/' + 'not-existing-contract-id')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).to.equal(HTTP.NO_CONTENT);
        });

        it('returns FORBIDDEN sending request AS USER', async () => {
            const response = await request
                .delete('/contracts/' + contract.id)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).to.equal(HTTP.FORBIDDEN);
        });

        it('returns UNAUTHORIZED sending request WITHOUT TOKEN', async () => {
            const response = await request.delete('/contracts/' + contract.id);

            expect(response.status).to.equal(HTTP.UNAUTHORIZED);
        });
    });
});
