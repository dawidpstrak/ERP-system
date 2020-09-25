import AuthenticationService from '@/services/AuthenticationService';

const initialState = () => {
    return {
        loggedUser: process.browser && JSON.parse(localStorage.getItem('loggedUser'))
    };
};

export const state = () => initialState();

export const getters = {
    loggedUser: state => state.loggedUser,
    isAdmin: state => state.loggedUser.roles.some(role => role.name === 'admin')
};

export const mutations = {
    SET_LOGGED_USER(state, loggedUser) {
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        state.loggedUser = loggedUser;
    },

    SET_USER_TOKEN(state, token) {
        localStorage.setItem('token', token);
    },

    REMOVE_USER_DATA(state) {
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('token');
        state.loggedUser = null;
    }
};

export const actions = {
    async login({ commit }, credentials) {
        const { data } = await AuthenticationService.login(credentials, this.$axios);

        commit('SET_LOGGED_USER', data.loggedUser);
        commit('SET_USER_TOKEN', data.token);
    },

    async renewLoggedUserData({ commit }) {
        const { data } = await this.$axios.get(`/me`);

        commit('SET_LOGGED_USER', data);
    }
};
