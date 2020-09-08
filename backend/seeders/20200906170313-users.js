'use strict';

const { Role } = require('../models');
const faker = require('faker');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const di = require('../di');
        const userRepository = di.get('repositories.user');
        const roleRepository = di.get('repositories.role');

        const adminRole = await roleRepository.findOne({
            where: {
                name: Role.ADMIN
            }
        });

        const userRole = await roleRepository.findOne({
            where: {
                name: Role.USER
            }
        });

        await queryInterface.bulkInsert('Users', [
            {
                id: uuidv4(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: 'admin@admin.com',
                password: bcrypt.hashSync('password', 12),
                birthDate: faker.date.past()
            },
            {
                id: uuidv4(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: 'user@user.com',
                password: bcrypt.hashSync('password', 12),
                birthDate: faker.date.past()
            }
        ]);
        const admin = await userRepository.findByEmail('admin@admin.com');
        await admin.addRoles(adminRole);

        const user = await userRepository.findByEmail('user@user.com');
        await user.addRoles(userRole);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Users');
    }
};
