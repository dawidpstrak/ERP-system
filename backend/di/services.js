module.exports = {
    services: {
        'services.auth.loginHandler': {
            class: '../services/Auth/LoginHandler',
            arguments: ['@repositories.user', '%bcrypt']
        },
        'services.user.userDaysOffAmountCalculator': {
            class: '../services/User/UserDaysOffAmountCalculator',
            arguments: ['@repositories.user']
        },
        'services.contract.contractsOverlapHandler': {
            class: '../services/Contract/ContractsOverlapHandler',
            arguments: ['@repositories.contract']
        }
    }
};
