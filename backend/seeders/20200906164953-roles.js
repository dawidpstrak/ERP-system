'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return await queryInterface.bulkInsert('Roles', [
            {
                id: uuidv4(),
                name: 'admin'
            },
            {
                id: uuidv4(),
                name: 'user'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return await queryInterface.bulkDelete('Roles');
    }
};
