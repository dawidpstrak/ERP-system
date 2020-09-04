module.exports = {
    services: {
        'controllers.user': {
            class: '../controllers/UserController',
            arguments: ['@repositories.user', '@repositories.role']
        },
        'controllers.auth': {
            class: '../controllers/AuthController',
            arguments: ['@repositories.user', '@services.auth.loginHandler']
        },
        'controllers.contract': {
            class: '../controllers/ContractController',
            arguments: [
                '@repositories.user',
                '@repositories.contract',
                '@services.daysOffAmount.userDaysOffAmountCalculator'
            ]
        },
        'controllers.vacationRequest': {
            class: '../controllers/VacationRequestController',
            arguments: [
                '@repositories.vacationRequest',
                '@repositories.user',
                '%moment',
                '@services.daysOffAmount.userDaysOffAmountCalculator'
            ]
        }
    }
};
