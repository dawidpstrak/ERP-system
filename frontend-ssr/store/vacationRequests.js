import axios from '@/plugins/axios';

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
        const { data } = await this.$axios.get('/vacationRequests');

        commit('SET_VACATION_REQUESTS', data);
    },

    async saveVacationRequest({ dispatch, getters }, vacationRequest) {
        if (vacationRequest.id) {
            await this.$axios.put(`/vacationRequests/${vacationRequest.id}`, vacationRequest);
        } else {
            await this.$axios.post('/vacationRequests', vacationRequest);
        }

        dispatch('fetchVacationRequests');

        if (!getters.isAdmin) {
            dispatch('renewLoggedUserData');
        }
    },

    async deleteVacationRequest({ dispatch, getters }, id) {
        await this.$axios.delete(`/vacationRequests/${id}`);

        dispatch('fetchVacationRequests');

        if (!getters.isAdmin) {
            dispatch('renewLoggedUserData');
        }
    }
};
