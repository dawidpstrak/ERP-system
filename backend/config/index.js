require('dotenv').config();

const env = (key, defaultValue = null) => process.env[key] || defaultValue;
const isEnabled = key => env(key) && env(key) === 'true';

const config = {
    app: {
        secretKey: env('SECRET_KEY'),
        serverPort: env('SERVER_PORT')
    },
    db: {
        name: env('DB_NAME'),
        username: env('DB_USERNAME'),
        password: env('DB_PASSWORD'),
        host: env('DB_HOST', 'localhost'),
        dialect: env('DB_DIALECT'),
        logging: isEnabled('SEQUELIZE_LOGGING') ? console.log : false,
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            timestamps: true
        }
    }
};

module.exports = config;