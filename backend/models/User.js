const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const db = require('../database/db');
const Role = require('./Role');

const User = db.sequelize.define(
    'User',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        surname: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING
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

User.belongsTo(Role, { as: 'role' });

module.exports = User;
