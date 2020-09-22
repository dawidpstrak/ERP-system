'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const di = require('../di');
        const userRepository = di.get('repositories.user');

        const user = await userRepository.findByEmail('user@user.com');
        const user2 = await userRepository.findByEmail('user2@user.com');

        await queryInterface.bulkInsert('Contracts', [
            {
                id: uuidv4(),
                userId: user.id,
                startDate: '2020-01-02',
                endDate: '2020-02-01',
                duration: 1,
                vacationsPerYear: 20,
                availableDaysOffAmount: 2
            },
            {
                id: uuidv4(),
                userId: user2.id,
                startDate: '2020-01-02',
                endDate: '2020-02-01',
                duration: 1,
                vacationsPerYear: 20,
                availableDaysOffAmount: 2
            }
        ]);

        await user.update({ availableDaysOffAmount: 2 });
        await user2.update({ availableDaysOffAmount: 2 });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Contracts');
    }
};
