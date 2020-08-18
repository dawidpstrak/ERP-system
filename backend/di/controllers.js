module.exports = {
    services: {
        'controllers.user': {
            class: '../controllers/UserController',
            arguments: ['@repositories.user', '@repositories.role']
        },
        'controllers.auth': {
            class: '../controllers/AuthController',
            arguments: ['@repositories.user', '@services.auth.loginHandler']
        }
    }
};
