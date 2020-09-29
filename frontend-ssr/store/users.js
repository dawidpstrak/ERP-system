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

    async saveUser({ dispatch }, user) {
        if (user.id) {
            await this.$axios.put(`/users/${user.id}`, user);
        } else {
            await this.$axios.post('/users', user);
        }

        //TODO not needed dispatch just update existing array
        dispatch('fetchUsers');
    },

    async deleteUser({ dispatch }, id) {
        await this.$axios.delete(`/users/${id}`);

        //TODO not needed dispatch just update existing array
        dispatch('fetchUsers');
    }
};
