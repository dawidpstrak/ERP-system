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
    },

    ADD_VACATION_REQUEST(state, newVacationRequest) {
        state.vacationRequests.push(newVacationRequest);
    },

    UPDATE_VACATION_REQUEST(state, updatedVacationRequest) {
        state.vacationRequests = state.vacationRequests.map(vacationRequest =>
            vacationRequest.id !== updatedVacationRequest.id ? vacationRequest : updatedVacationRequest
        );
    },

    DELETE_VACATION_REQUEST(state, id) {
        state.vacationRequests = state.vacationRequests.filter(vacationRequest => vacationRequest.id !== id);
    }
};

export const actions = {
    async fetchVacationRequests({ commit }) {
        const data = await this.$axios.$get('/vacationRequests');

        commit('SET_VACATION_REQUESTS', data);
    },

    async saveVacationRequest({ dispatch, commit, rootGetters }, vacationRequest) {
        if (vacationRequest.id) {
            const updatedVacationRequest = await this.$axios.$put(
                `/vacationRequests/${vacationRequest.id}`,
                vacationRequest
            );

            commit('UPDATE_VACATION_REQUEST', updatedVacationRequest);
        } else {
            const newVacationRequest = await this.$axios.$post('/vacationRequests', vacationRequest);

            commit('ADD_VACATION_REQUEST', newVacationRequest);
        }

        if (!rootGetters.isAdmin) {
            dispatch('renewLoggedUserData', {}, { root: true }); // for dispatching action from another module
        }
    },

    async deleteVacationRequest({ dispatch, commit, rootGetters }, id) {
        await this.$axios.delete(`/vacationRequests/${id}`);

        commit('DELETE_VACATION_REQUEST', id);

        if (!rootGetters.isAdmin) {
            dispatch('renewLoggedUserData', {}, { root: true }); // for dispatching action from another module
        }
    }
};
