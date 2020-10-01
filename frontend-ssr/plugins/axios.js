import HTTP from 'http-status-codes';

export default ({ $axios, app }, inject) => {
    const axios = $axios.create();

    axios.setBaseURL(process.env.apiUrl);

    const tokenExpired = error => {
        return (
            error.response &&
            error.response.status === HTTP.UNAUTHORIZED &&
            error.response.data.message !== 'Wrong credentials'
        );
    };

    axios.onError(async error => {
        if (tokenExpired(error)) {
            await app.$auth.logout();
        }

        //TODO token expiration bug

        throw error;
    });

    inject('axios', axios);
};
