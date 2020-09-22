const { v4: uuidv4 } = require('uuid');
const faker = require('faker');

const { User, Role, Contract, VacationRequest } = require('../../models');

module.exports = async () => {
    try {
        const adminRole = await Role.create({
            id: uuidv4(),
            name: 'admin'
        });

        const userRole = await Role.create({
            id: uuidv4(),
            name: 'user'
        });

        const admin = await User.create({
            id: uuidv4(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: 'admin@erpsystem.test',
            password: 'password',
            birthDate: faker.date.past()
        });

        await admin.addRoles(adminRole);

        const user = await User.create({
            id: uuidv4(),
            firstName: 'user1',
            lastName: 'user1',
            email: 'user@erpsystem.test',
            password: 'password',
            birthDate: faker.date.past()
        });

        await user.addRoles(userRole);

        const user2 = await User.create({
            id: uuidv4(),
            firstName: 'user2',
            lastName: 'user2',
            email: 'user2@erpsystem.test',
            password: 'password',
            birthDate: faker.date.past()
        });

        await user2.addRoles(userRole);

        await Contract.create({
            id: uuidv4(),
            userId: user.id,
            startDate: '2020-01-02',
            endDate: '2020-02-01',
            duration: 1,
            vacationsPerYear: 20,
            availableDaysOffAmount: 2
        });

        await Contract.create({
            id: uuidv4(),
            userId: user2.id,
            startDate: '2020-01-02',
            endDate: '2020-02-01',
            duration: 1,
            vacationsPerYear: 20,
            availableDaysOffAmount: 2
        });

        await VacationRequest.create({
            id: uuidv4(),
            userId: user.id,
            status: 'pending',
            startDate: '2020-01-01',
            endDate: '2020-01-03',
            requestedDaysOff: 2
        });

        await VacationRequest.create({
            id: uuidv4(),
            userId: user2.id,
            status: 'pending',
            startDate: '2020-01-01',
            endDate: '2020-01-03',
            requestedDaysOff: 2
        });
    } catch (error) {
        console.error(error);
    }
};
