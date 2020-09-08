module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'UserRoles',
            {
                userId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                    references: {
                        model: 'Users',
                        key: 'id'
                    },
                    primaryKey: true
                },
                roleId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                    references: {
                        model: 'Roles',
                        key: 'id'
                    },
                    primaryKey: true
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal('NOW()')
                }
            },
            {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }
        );
    },
    down: queryInterface => {
        return queryInterface.dropTable('UserRoles');
    }
};
