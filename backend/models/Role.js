'use strict';

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define(
        'Role',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING
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

    return Role;
};
