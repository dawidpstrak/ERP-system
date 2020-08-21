'use strict';

module.exports = (sequelize, DataTypes) => {
    const Contract = sequelize.define(
        'Contract',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                onDelete: 'cascade',
                references: {
                    model: 'User',
                    key: 'id'
                }
            },
            startDate: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            endDate: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
            },
            vacationsPerYear: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            daysOff: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: 'Contracts'
        }
    );

    Contract.associate = models => {
        Contract.belongsTo(models.User, {
            as: 'user'
        });
    };

    Contract.UPDATABLE_FIELDS = ['startDate', 'endDate', 'duration', 'status', 'vacationsPerYear', 'daysOff'];

    return Contract;
};
