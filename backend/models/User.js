'use strict';

const bcrypt = require('bcrypt');
const config = require('../config');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
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
            },
            availableDaysOffAmount: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            }
        },
        {
            defaultScope: {
                attributes: { exclude: ['password'] }
            },
            hooks: {
                beforeSave: (user, options) => {
                    if (options.fields.includes('password')) {
                        if (!user.password) {
                            return;
                        }

                        user.password = bcrypt.hashSync(user.password, config.app.bcryptSaltRounds);
                    }
                }
            }
        }
    );

    User.associate = models => {
        User.belongsToMany(models.Role, {
            as: 'roles',
            through: models.UserRole,
            foreignKey: 'userId',
            otherKey: 'roleId'
        });

        User.hasMany(models.Contract, {
            as: 'contracts',
            foreignKey: 'userId',
            onDelete: 'cascade',
            hooks: 'true'
        });

        User.hasMany(models.VacationRequest, {
            as: 'vacationRequests',
            foreignKey: 'userId',
            onDelete: 'cascade',
            hooks: 'true'
        });
    };

    User.UPDATABLE_FIELDS = ['firstName', 'lastName', 'email', 'birthDate'];
    User.CREATABLE_FIELDS = [...User.UPDATABLE_FIELDS, 'password'];

    return User;
};
