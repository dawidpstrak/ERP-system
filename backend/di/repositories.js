module.exports = {
    services: {
        'repositories.user': {
            class: '../repositories/UserRepository'
        },
        'repositories.role': {
            class: '../repositories/RoleRepository'
        },
        'repositories.contract': {
            class: '../repositories/ContractRepository'
        },
        'repositories.vacationRequest': {
            class: '../repositories/VacationRequestRepository'
        }
    }
};
