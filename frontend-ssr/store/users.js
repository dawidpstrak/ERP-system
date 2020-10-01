export const state = () => {
    return {
        users: []
    };
};

export const getters = {
    users: state => state.users
};

export const mutations = {
    SET_USERS(state, users) {
        state.users = users;
    },

    ADD_USER(state, newUser) {
        state.users.push(newUser);
    },

    UPDATE_USER(state, updatedUser) {
        const newState = state.users.filter(user => user.id !== updatedUser.id);

        newState.push(updatedUser);

        state.users = newState;
    },

    DELETE_USER(state, id) {
        state.users = state.users.filter(user => user.id !== id);
    }
};

export const actions = {
    async fetchUsers({ commit }, query) {
        if (query) {
            const data = await this.$axios.$get('/users', { params: { query } });

            return data;
        } else {
            const data = await this.$axios.$get('/users');

            commit('SET_USERS', data);
        }
    },

    async saveUser({ commit }, user) {
        if (user.id) {
            const updatedUser = await this.$axios.$put(`/users/${user.id}`, user);

            commit('UPDATE_USER', updatedUser);
        } else {
            const newUser = await this.$axios.$post('/users', user);

            commit('ADD_USER', newUser);
        }
    },

    async deleteUser({ commit }, id) {
        await this.$axios.delete(`/users/${id}`);

        commit('DELETE_USER', id);
    }
};
