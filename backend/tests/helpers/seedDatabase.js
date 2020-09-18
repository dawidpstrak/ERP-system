const { v4: uuidv4 } = require('uuid');
const faker = require('faker');
const bcrypt = require('bcrypt');

const { User, Role, Contract, sequelize } = require('../../models');

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
            email: 'admin@admin.com',
            password: 'password',
            birthDate: faker.date.past()
        });

        await admin.addRoles(adminRole);

        const user = await User.create({
            id: uuidv4(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: 'user@user.com',
            password: 'password',
            birthDate: faker.date.past(),
            availableDaysOffAmount: 2
        });

        await user.addRoles(userRole);

        const user2 = await User.create({
            id: uuidv4(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: 'user2@user.com',
            password: 'password',
            birthDate: faker.date.past(),
            availableDaysOffAmount: 2
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
    } catch (error) {
        console.error(error);
    }
};
