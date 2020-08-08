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
                type: DataTypes.STRING
            },
            surname: {
                type: DataTypes.STRING
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING
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

    return User;
};
