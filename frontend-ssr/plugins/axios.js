export default ({ $axios, redirect }, inject) => {
    const axios = $axios.create();

    axios.setBaseURL(process.env.NUXT_ENV_API_URL);

    axios.onRequest(config => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    });

    const isNotLoginError = error => {
        return error.response.data.message !== 'Wrong credentials' && error.response.status === 401;
    };

    axios.onError(error => {
        if (error.response.status === 401 && isNotLoginError(error)) {
            // JWT token expired  - logout

            redirect('/logout');
        }
    });

    inject('axios', axios);
};
