'use strict';

module.exports = (sequelize, DataTypes) => {
    const Contract = sequelize.define(
        'Contract',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                onDelete: 'cascade',
                references: {
                    model: 'Users',
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
                defaultValue: 'active',
                allowNull: false
            },
            vacationsPerYear: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            availableDaysOffAmount: {
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

    Contract.UPDATABLE_FIELDS = [
        'startDate',
        'endDate',
        'duration',
        'status',
        'vacationsPerYear',
        'availableDaysOffAmount'
    ];

    return Contract;
};
