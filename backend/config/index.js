const fs = require('fs');

const testEnvPath = fs.existsSync('.env.test') ? '.env.test' : '../backend/.env.test';

require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? testEnvPath : '.env'
});

const env = (key, defaultValue = '') => process.env[key] || defaultValue;
const isEnabled = key => env(key) && env(key) === 'true';

const config = {
    app: {
        env: env('NODE_ENV'),
        secretKey: env('SECRET_KEY'),
        serverPort: env('SERVER_PORT'),
        bcryptSaltRounds: parseInt(env('BCRYPT_SALT_ROUNDS'))
    },
    db: {
        name: env('DB_NAME'),
        username: env('DB_USERNAME'),
        password: env('DB_PASSWORD'),
        host: env('DB_HOST', 'localhost'),
        port: env('DB_PORT'),
        dialect: env('DB_DIALECT'),
        logging: isEnabled('SEQUELIZE_LOGGING') ? console.log : false,
        url: `${
            env('DB_DIALECT') +
            '://' +
            env('DB_USERNAME') +
            ':' +
            env('DB_PASSWORD') +
            '@' +
            env('DB_HOST') +
            ':' +
            env('DB_PORT') +
            '/' +
            env('DB_NAME')
        }`,
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            timestamps: true
        }
    }
};

module.exports = config;
