'use strict';

module.exports = (sequelize, DataTypes) => {
    const VacationRequest = sequelize.define(
        'VacationRequest',
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
                    model: 'user',
                    key: 'id'
                }
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'pending'
            },
            startDate: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            endDate: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            requestedDaysOff: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: 'VacationRequests'
        }
    );

    VacationRequest.associate = models => {
        VacationRequest.belongsTo(models.User, {
            as: 'user'
        });
    };

    VacationRequest.UPDATABLE_FIELDS = ['startDate', 'endDate', 'requestedDaysOff'];

    return VacationRequest;
};
