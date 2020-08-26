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
        Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => response,
    error => {
        if ([401, 403].includes(error.response.status)) {
            // JWT token expired or unauthorized request- logout

            window.location.href = '/logout';
        }
    }
);

export default axios;
