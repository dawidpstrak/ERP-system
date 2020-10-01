export const state = () => {
    return {
        vacationRequests: []
    };
};

export const getters = {
    vacationRequests: state => state.vacationRequests
};

export const mutations = {
    SET_VACATION_REQUESTS(state, vacationRequests) {
        state.vacationRequests = vacationRequests;
    }
};

export const actions = {
    async fetchVacationRequests({ commit }) {
        const data = await this.$axios.$get('/vacationRequests');

        commit('SET_VACATION_REQUESTS', data);
    },

    async saveVacationRequest({ dispatch, rootGetters }, vacationRequest) {
        if (vacationRequest.id) {
            await this.$axios.put(`/vacationRequests/${vacationRequest.id}`, vacationRequest);
        } else {
            await this.$axios.post('/vacationRequests', vacationRequest);
        }

        //TODO not needed dispatch just update existing array
        dispatch('fetchVacationRequests');

        if (!rootGetters.isAdmin) {
            dispatch('renewLoggedUserData', {}, { root: true }); // for dispatching action from another module
        }
    },

    async deleteVacationRequest({ dispatch, rootGetters }, id) {
        await this.$axios.delete(`/vacationRequests/${id}`);

        //TODO not needed dispatch just update existing array
        dispatch('fetchVacationRequests');

        if (!rootGetters.isAdmin) {
            dispatch('renewLoggedUserData', {}, { root: true }); // for dispatching action from another module
        }
    }
};
