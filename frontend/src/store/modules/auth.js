import AuthenticationService from '@/services/AuthenticationService';

const initialState = () => {
    return {
        loggedUser: JSON.parse(localStorage.getItem('loggedUser')),
        token: JSON.parse(localStorage.getItem('token'))
    };
};

const state = () => initialState();

const getters = {
    loggedUser: state => state.loggedUser,
    getToken: state => state.token
};

const mutations = {
    setLoggedUser(state, loggedUser) {
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        state.loggedUser = loggedUser;
    },
    setUserToken(state, token) {
        localStorage.setItem('token', JSON.stringify(token));
        state.token = token;
    },
    logout(state) {
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('token');
        state.loggedUser = null;
        state.token = null;
    }
};

const actions = {
    async login({ commit }, credentials) {
        const { data } = await AuthenticationService.login(credentials);
        commit('setLoggedUser', data.user);
        commit('setUserToken', data.token);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
