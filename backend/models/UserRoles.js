'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define(
        'UserRole',
        {
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            roleId: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'Roles',
                    key: 'id'
                }
            }
        },
        {
            tableName: 'UserRoles',
            updatedAt: false
        }
    );

    return UserRole;
};
