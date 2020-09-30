import HTTP from 'http-status-codes';

export default ({ $axios, app }, inject) => {
    const axios = $axios.create();

    axios.setBaseURL(process.env.apiUrl);

    const isNotLoginError = error => {
        return (
            error.response &&
            error.response.data.message !== 'Wrong credentials' &&
            error.response.status === HTTP.UNAUTHORIZED
        );
    };

    axios.onError(async error => {
        if (error.response && error.response.status === HTTP.UNAUTHORIZED && isNotLoginError(error)) {
            // JWT token expired  - logout

            await app.$auth.logout();
        }
    });

    inject('axios', axios);
};
