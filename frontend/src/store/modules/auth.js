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
    SET_LOGGED_USER(state, loggedUser) {
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        state.loggedUser = loggedUser;
    },
    SET_USER_TOKEN(state, token) {
        localStorage.setItem('token', JSON.stringify(token));
        state.token = token;
    },
    REMOVE_USER_DATA(state) {
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('token');
        state.loggedUser = null;
        state.token = null;
        state.employees = null;
    }
};

const actions = {
    async login({ commit }, credentials) {
        const { data } = await AuthenticationService.login(credentials);
        commit('SET_LOGGED_USER', data.user);
        commit('SET_USER_TOKEN', data.token);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
