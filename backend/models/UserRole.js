'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define(
        'UserRole',
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'User',
                    key: 'id'
                }
            },
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'Role',
                    key: 'id'
                }
            }
        },
        {
            tableName: 'UserRoles'
        }
    );

    return UserRole;
};
