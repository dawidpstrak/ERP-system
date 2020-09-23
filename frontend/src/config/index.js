require('dotenv').config();

const env = (key, defaultValue = null) => process.env[key] || defaultValue;

const config = {
    apiUrl: env('VUE_APP_API_URL'),
    clientUrl: env('CLIENT_URL')
};

module.exports = config;
