import globalAxios from 'axios';
import config from '../config';

const axios = globalAxios.create({
    baseURL: config.apiUrl
});

export default axios;
