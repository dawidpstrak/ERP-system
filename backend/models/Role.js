'use strict';

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define(
        'Role',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: 'Roles'
        }
    );

    Role.associate = models => {
        Role.belongsToMany(models.User, {
            as: 'users',
            through: models.UserRole,
            foreignKey: 'roleId',
            otherKey: 'userId'
        });
    };

    Role.ADMIN = 'admin';
    Role.USER = 'user';

    return Role;
};
