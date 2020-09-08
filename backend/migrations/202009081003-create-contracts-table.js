module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable(
            'Contracts',
            {
                id: {
                    primaryKey: true,
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4
                },
                userId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                    onDelete: 'cascade',
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                },
                startDate: {
                    type: Sequelize.DATEONLY,
                    allowNull: false
                },
                endDate: {
                    type: Sequelize.DATEONLY,
                    allowNull: false
                },
                duration: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 3
                },
                status: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: 'active'
                },
                vacationsPerYear: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                availableDaysOffAmount: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal('NOW()')
                }
            },
            {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }
        ),

    down: queryInterface => queryInterface.dropTable('Contracts')
};
