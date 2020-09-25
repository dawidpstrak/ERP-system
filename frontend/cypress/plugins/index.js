const seedDatabase = require('../../../backend/tests/helpers/seedDatabase');
const truncateDatabase = require('../../../backend/tests/helpers/truncateDatabase');

const appConfig = require('../../src/config');

module.exports = (on, config) => {
    on('task', {
        async fillDatabase() {
            await seedDatabase();

            return true; // little workaround - task function must return something
        },

        async clearDatabase() {
            await truncateDatabase();

            return true; // little workaround - task function must return something
        }
    });

    config.baseUrl = appConfig.clientUrl;

    return config;
};
