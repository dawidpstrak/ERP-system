'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            surname: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            birthDate: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            defaultScope: {
                attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
            },
            hooks: {
                beforeSave: (user, options) => {
                    if (options.fields.includes('password')) {
                        if (!user.password) {
                            return;
                        }

                        user.password = bcrypt.hashSync(user.password, 10);
                    }
                }
            }
        }
    );

    User.associate = models => {
        User.belongsToMany(models.Role, {
            as: 'role',
            through: models.UserRole,
            foreignKey: 'userId',
            otherKey: 'roleId'
        });

        User.hasMany(models.Contract, {
            as: 'contracts',
            foreignKey: 'userId'
        });
    };

    User.UPDATABLE_FIELDS = ['name', 'surname', 'email', 'birthDate'];

    return User;
};
