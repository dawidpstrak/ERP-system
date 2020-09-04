'use strict';

module.exports = (sequelize, DataTypes) => {
    const VacationRequest = sequelize.define(
        'VacationRequest',
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
                    model: 'user',
                    key: 'id'
                }
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
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

    VacationRequest.UPDATABLE_FIELDS = ['startDate', 'endDate', 'status', 'requestedDaysOff'];

    VacationRequest.ACTIVE = 'active';
    VacationRequest.PENDING = 'pending';

    return VacationRequest;
};
