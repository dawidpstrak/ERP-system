module.exports = {
    services: {
        'services.auth.loginHandler': {
            class: '../services/Auth/LoginHandler',
            arguments: ['@repositories.user', '%bcrypt']
        }
    }
};
