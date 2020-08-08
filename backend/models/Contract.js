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
                allowNull: false,
                defaultValue: 3
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'active'
            },
            daysOff: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 20
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

    return Contract;
};
