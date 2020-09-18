const HTTP = require('http-status-codes');
const { expect } = require('chai');

const app = require('../');
const request = require('supertest')(app);

const loginAsUser = require('./helpers/loginAsUser');
const loginAsAdmin = require('./helpers/loginAsAdmin');
const truncateDatabase = require('./helpers/truncateDatabase');
const seedDatabase = require('./helpers/seedDatabase');

beforeAll(async () => {
    await seedDatabase();
});

afterAll(async () => {
    await truncateDatabase();
});

describe('AuthController', () => {
    describe('POST /auth/login', () => {
        it('returns OK while logged in AS ADMIN', async () => {
            const response = await loginAsAdmin(request);

            const { loggedUser } = response.body;

            expect(response.status).to.equal(HTTP.OK);
            expect(loggedUser).to.have.property('email', 'admin@admin.com');
            expect(loggedUser).to.not.have.property('password');
            expect(response.body).to.have.property('token');
        });

        it('returns OK while logged in AS USER', async () => {
            const response = await loginAsUser(request);

            const { loggedUser } = response.body;

            expect(response.status).to.equal(HTTP.OK);
            expect(loggedUser).to.have.property('email', 'user@user.com');
            expect(loggedUser).to.not.have.property('password');
            expect(response.body).to.have.property('token');
        });

        it('returns BAD_REQUEST sending invalid data (empty)', async () => {
            const response = await request.post('/auth/login').send({ email: '', password: '' });

            const { errors } = response.body;

            expect(response.status).to.equal(HTTP.BAD_REQUEST);
            expect(errors).to.have.lengthOf(4);
            expect(errors).to.deep.equal([
                { message: 'email can not be empty', param: 'email' },
                { message: 'must be valid email adress', param: 'email' },
                { message: 'password can not be empty', param: 'password' },
                {
                    message: 'password length must be between 6 and 32',
                    param: 'password'
                }
            ]);
        });

        it('returns UNAUTHORIZED sending valid data with non existing email', async () => {
            const response = await request.post('/auth/login').send({ email: 'wrong@email.com', password: 'password' });

            expect(response.status).to.equal(HTTP.UNAUTHORIZED);
            expect(response.body).to.deep.equal({ message: 'Wrong credentials' });
        });

        it('returns UNATHORIZED when user with passed email exist but password is wrong', async () => {
            const response = await request
                .post('/auth/login')
                .send({ email: 'user@user.com', password: 'wrong-password' });

            expect(response.status).to.equal(HTTP.UNAUTHORIZED);
            expect(response.body).to.deep.equal({ message: 'Wrong credentials' });
        });

        it('returns UNAUTHORIZED when jwt token is wrong', async () => {
            /* I test this case only once for whole app. Request to /contracts is just random choice. Every route is
             * tested separately for JWT token present in headers but for wrong token case only once - here.
             */
            const response = await request.get('/contracts').set('Authorization', `Bearer definitely-wrong-jwt-token`);

            expect(response.status).to.equal(HTTP.UNAUTHORIZED);
        });
    });
});
