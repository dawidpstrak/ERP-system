module.exports = {
    services: {
        'services.auth.loginHandler': {
            class: '../services/Auth/LoginHandler',
            arguments: ['@repositories.user', '%bcryptjs']
        },
        'services.user.userDaysOffAmountCalculator': {
            class: '../services/User/UserDaysOffAmountCalculator',
            arguments: ['@repositories.user']
        },
        'services.contract.contractsOverlapHandler': {
            class: '../services/Contract/ContractsOverlapHandler',
            arguments: ['@repositories.contract']
        },
        'services.contract.contractCalculator': {
            class: '../services/Contract/ContractCalculator',
            arguments: ['@repositories.contract', '%moment']
        }
    }
};
