module.exports = {
    services: {
        'services.auth.loginHandler': {
            class: '../services/Auth/LoginHandler',
            arguments: ['@repositories.user', '%bcrypt']
        },
        'services.daysOffAmount.userDaysOffAmountCalculator': {
            class: '../services/DaysOffAmount/UserDaysOffAmountCalculator',
            arguments: ['@repositories.user']
        }
    }
};
