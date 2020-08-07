import axios from '@/plugins/axios';

export default {
    login(credentials) {
        return axios.post('auth/login', credentials);
    }
};
