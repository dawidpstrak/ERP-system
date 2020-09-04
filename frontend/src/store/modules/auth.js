import AuthenticationService from '@/services/AuthenticationService';
import axios from '@/plugins/axios';

const initialState = () => {
    return {
        loggedUser: JSON.parse(localStorage.getItem('loggedUser'))
    };
};

const state = () => initialState();

const getters = {
    loggedUser: state => state.loggedUser,
    isAdmin: state => state.loggedUser.roles.some(role => role.name === 'admin')
};

const mutations = {
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

const actions = {
    async login({ commit }, credentials) {
        const { data } = await AuthenticationService.login(credentials);

        commit('SET_LOGGED_USER', data.loggedUser);
        commit('SET_USER_TOKEN', data.token);
    },

    async renewLoggedUserData({ commit, getters }) {
        const { data } = await axios.get(`users/${getters.loggedUser.id}`);

        commit('SET_LOGGED_USER', data);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
