export default {
    login(credentials, axios) {
        return axios.post('/auth/login', credentials);
    }
};
