import globalAxios from 'axios';
import config from '../config';

const axios = globalAxios.create({
    baseURL: config.apiUrl
});

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    error => {
        throw error;
    }
);

const isNotLoginError = error => {
    return error.response.data.message !== 'Wrong credentials' && error.response.status === 401;
};

axios.interceptors.response.use(
    response => response,

    error => {
        if (error.response.status === 401 && isNotLoginError(error)) {
            // JWT token expired  - logout

            window.location.href = '/logout';
        }
        throw error;
    }
);

export default axios;
