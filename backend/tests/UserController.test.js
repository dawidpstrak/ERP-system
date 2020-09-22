const HTTP = require('http-status-codes');
const { expect } = require('chai');

const app = require('../');
const request = require('supertest')(app);
const di = require('../di');

const userRepository = di.get('repositories.user');

const loginAsAdmin = require('./helpers/loginAsAdmin');
const loginAsUser = require('./helpers/loginAsUser');
const truncateDatabase = require('./helpers/truncateDatabase');
const seedDatabase = require('./helpers/seedDatabase');

let userToken, adminToken, loggedUser, loggedAdmin;

beforeAll(async () => {
    await seedDatabase();

    const loginAsUserResponse = await loginAsUser(request);
    const loginAsAdminResponse = await loginAsAdmin(request);

    userToken = loginAsUserResponse.body.token;
    adminToken = loginAsAdminResponse.body.token;
    loggedUser = loginAsUserResponse.body.loggedUser;
    loggedAdmin = loginAsAdminResponse.body.loggedUser;
});

afterAll(async () => {
    await truncateDatabase();
});

describe('UserController', () => {
    describe('GET /users', () => {
        it('returns OK and user that match query, sending request AS ADMIN', async () => {
            const response = await request
                .get('/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .query({ query: loggedUser.firstName });

            expect(response.status).to.equal(HTTP.OK);
            expect(response.body).to.have.length(1);
            expect(response.body[0]).to.include({ id: loggedUser.id, firstName: loggedUser.firstName });
        });

        it('returns OK and all users, sending request AS ADMIN', async () => {
            const response = await request.get('/users').set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).to.equal(HTTP.OK);
            expect(response.body).to.have.length(2);
        });

        it('returns FORBIDDEN sending request AS USER', async () => {
            const response = await request.get('/users').set('Authorization', `Bearer ${userToken}`);

            expect(response.status).to.equal(HTTP.FORBIDDEN);
        });

        it('returns UNAUTHORIZED sending request WITHOUT TOKEN', async () => {
            const response = await request.get('/users');

            expect(response.status).to.equal(HTTP.UNAUTHORIZED);
        });
    });

    describe('GET /me', () => {
        it('returns OK with loggedUser object, sending request AS USER', async () => {
            const response = await request.get('/me').set('Authorization', `Bearer ${userToken}`);

            expect(response.status).to.equal(HTTP.OK);
            expect(response.body).to.include({ id: loggedUser.id });
        });

        it('returns OK with loggedUser object, sending request AS Admin', async () => {
            const response = await request.get('/me').set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).to.equal(HTTP.OK);
            expect(response.body).to.include({ id: loggedAdmin.id });
        });

        it('returns UNAUTHORIZED sending request WITHOUT TOKEN', async () => {
            const response = await request.get('/me');

            expect(response.status).to.equal(HTTP.UNAUTHORIZED);
        });
    });

    describe('POST /users', () => {
        it('returns CREATED and new user object, sending request AS ADMIN', async () => {
            const response = await request
                .post('/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    firstName: 'newUser',
                    lastName: 'newUser',
                    email: 'newUser@newUser.com',
                    password: 'password',
                    birthDate: '1999-01-01',
                    roles: [{ name: 'user' }]
                });

            const newUser = await userRepository.findByEmail('newUser@newUser.com');
            const newUserRoles = await newUser.getRoles();

            expect(response.status).to.equal(HTTP.CREATED);
            expect(response.body).to.not.have.property('password');
            expect(newUser).to.not.be.null;
            expect(newUserRoles).to.not.be.null;
        });

        it('returns CREATED and NOT ADDING AVAILABLE DAYS OFF AMOUNT to user, sending request AS ADMIN', async () => {
            const response = await request
                .post('/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    firstName: 'newUser',
                    lastName: 'newUser',
                    email: 'newUser2@newUser.com',
                    password: 'password',
                    birthDate: '1999-01-01',
                    availableDaysOffAmount: 99999,
                    roles: [{ name: 'user' }]
                });

            const newUser = await userRepository.findByEmail('newUser@newUser.com');
            const newUserRoles = await newUser.getRoles();

            expect(response.status).to.equal(HTTP.CREATED);
            expect(response.body).to.not.have.property('password');
            expect(newUser).to.not.be.null;
            expect(newUser.availableDaysOffAmount).to.equal(0);
            expect(newUserRoles).to.not.be.null;
        });

        it('returns BAD_REQUEST when email is taken, sending request AS ADMIN', async () => {
            const response = await request
                .post('/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    firstName: 'newUser',
                    lastName: 'newUser',
                    email: 'user@erpsystem.test',
                    password: 'password',
                    birthDate: '1999-01-01',
                    roles: [{ name: 'user' }]
                });

            expect(response.body).to.deep.equal({
                errors: [{ message: 'Email address already exists!', param: 'email' }]
            });
            expect(response.status).to.equal(HTTP.BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending invalid data (empty) AS ADMIN', async () => {
            const response = await request.post('/users').set('Authorization', `Bearer ${adminToken}`).send({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                birthDate: '',
                roles: []
            });

            const { errors } = response.body;

            expect(response.status).to.equal(HTTP.BAD_REQUEST);
            expect(errors).to.have.lengthOf(11);
            expect(errors).to.deep.equal([
                { message: 'password can not be empty', param: 'password' },
                { message: 'password length must be between 6 and 32', param: 'password' },
                { message: 'Should not be empty', param: 'roles' },
                { message: 'Should not be empty', param: 'firstName' },
                { message: 'Invalid name format. Min length is 3 chars. Max length is 255 chars', param: 'firstName' },
                { message: 'Should not be empty', param: 'lastName' },
                {
                    message: 'Invalid surname format. Min length is 3 chars. Max length is 255 chars',
                    param: 'lastName'
                },
                { message: 'email can not be empty', param: 'email' },
                { message: 'email address is not valid', param: 'email' },
                { message: 'Should not be empty', param: 'birthDate' },
                { message: 'Invalid value', param: 'birthDate' }
            ]);
        });

        it('returns FORBIDDEN sending request AS USER', async () => {
            const response = await request.post('/users').set('Authorization', `Bearer ${userToken}`);

            expect(response.status).to.equal(HTTP.FORBIDDEN);
        });

        it('returns UNAUTHORIZED sending request WITHOUT TOKEN', async () => {
            const response = await request.post('/users');

            expect(response.status).to.equal(HTTP.UNAUTHORIZED);
        });
    });

    describe('PUT /users/:id', () => {
        it('returns OK, and updated user, sending request AS ADMIN', async () => {
            const user = await userRepository.findByPk(loggedUser.id);

            expect(user).to.include({
                firstName: 'user1',
                lastName: 'user1',
                email: 'user@erpsystem.test',
                birthDate: loggedUser.birthDate,
                availableDaysOffAmount: 0
            });

            const response = await request
                .put('/users/' + user.id)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    firstName: 'updated',
                    lastName: 'updated',
                    email: 'updated@user.com',
                    birthDate: '1999-01-01'
                });

            const updatedUser = await userRepository.findByPk(loggedUser.id);

            expect(response.status).to.equal(HTTP.OK);
            expect(updatedUser).to.include({
                firstName: 'updated',
                lastName: 'updated',
                email: 'updated@user.com',
                birthDate: '1999-01-01',
                availableDaysOffAmount: 0
            });
        });

        it('returns OK, and updated user, NOT UPDATING AVAILABLE DAYS OFF AMOUNT, sending request AS ADMIN', async () => {
            const user = await userRepository.findByPk(loggedUser.id);

            expect(user).to.include({
                firstName: 'updated',
                lastName: 'updated',
                email: 'updated@user.com',
                birthDate: user.birthDate,
                availableDaysOffAmount: 0
            });

            const response = await request
                .put('/users/' + user.id)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    firstName: 'updated2',
                    lastName: 'updated2',
                    email: 'updated2@user.com',
                    birthDate: '1999-01-01',
                    availableDaysOffAmount: 999999
                });

            const updatedUser = await userRepository.findByPk(loggedUser.id);

            expect(response.status).to.equal(HTTP.OK);
            expect(updatedUser).to.include({
                firstName: 'updated2',
                lastName: 'updated2',
                email: 'updated2@user.com',
                birthDate: '1999-01-01',
                availableDaysOffAmount: 0
            });
        });

        it('returns NOT_FOUND when user does not exist, sending request AS ADMIN', async () => {
            const response = await request
                .put('/users/' + 'not-existing-user-id')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    firstName: 'update',
                    lastName: 'update',
                    email: 'update@user.com',
                    birthDate: '1999-01-01',
                    roles: [{ name: 'user' }]
                });

            expect(response.status).to.equal(HTTP.NOT_FOUND);
        });

        it('returns BAD_REQUEST sending invalid data (empty) AS ADMIN', async () => {
            const response = await request
                .put('/users/' + loggedUser.id)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    firstName: '',
                    lastName: '',
                    email: '',
                    birthDate: '',
                    roles: []
                });

            const { errors } = response.body;

            expect(response.status).to.equal(HTTP.BAD_REQUEST);
            expect(errors).to.have.lengthOf(8);
            expect(errors).to.deep.equal([
                { message: 'Should not be empty', param: 'firstName' },
                { message: 'Invalid name format. Min length is 3 chars. Max length is 255 chars', param: 'firstName' },
                { message: 'Should not be empty', param: 'lastName' },
                {
                    message: 'Invalid surname format. Min length is 3 chars. Max length is 255 chars',
                    param: 'lastName'
                },
                { message: 'email can not be empty', param: 'email' },
                { message: 'email address is not valid', param: 'email' },
                { message: 'Should not be empty', param: 'birthDate' },
                { message: 'Invalid value', param: 'birthDate' }
            ]);
        });

        it('returns FORBIDDEN sending request AS USER', async () => {
            const response = await request.put('/users/' + loggedUser.id).set('Authorization', `Bearer ${userToken}`);

            expect(response.status).to.equal(HTTP.FORBIDDEN);
        });

        it('returns UNAUTHORIZED sending request WITHOUT TOKEN', async () => {
            const response = await request.put('/users/' + loggedUser.id);

            expect(response.status).to.equal(HTTP.UNAUTHORIZED);
        });
    });

    describe('DELETE /users/:id', () => {
        it('returns NO_CONTENT, and deleting user, sending request AS ADMIN', async () => {
            const user = await userRepository.findByPk(loggedUser.id);

            expect(user).to.not.be.null;

            const response = await request
                .delete('/users/' + loggedUser.id)
                .set('Authorization', `Bearer ${adminToken}`);

            const deletedUser = await userRepository.findByPk(loggedUser.id);

            expect(response.status).to.equal(HTTP.NO_CONTENT);
            expect(deletedUser).to.be.null;
        });

        it('returns NO_CONTENT sending delete request with wrong id AS ADMIN', async () => {
            const response = await request
                .delete('/users/' + 'not-existing-user-id')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).to.equal(HTTP.NO_CONTENT);
        });

        it('returns FORBIDDEN sending request AS USER', async () => {
            const response = await request
                .delete('/users/' + loggedUser.id)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).to.equal(HTTP.FORBIDDEN);
        });

        it('returns UNAUTHORIZED sending request WITHOUT TOKEN', async () => {
            const response = await request.delete('/users/' + loggedUser.id);

            expect(response.status).to.equal(HTTP.UNAUTHORIZED);
        });
    });
});
