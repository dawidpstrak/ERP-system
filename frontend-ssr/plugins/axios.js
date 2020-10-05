import HTTP from 'http-status-codes';

export default ({ $axios, app, redirect, route }, inject) => {
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

            if (route.path !== '/') {
                // in case when token expired and user refreshed page $auth.logout() not redirecting to /
                redirect('/');
            }
        } else {
            throw error;
        }
    });

    inject('axios', axios);
};
