import axios from '@/plugins/axios';

const state = () => {
    return {
        vacationRequests: []
    };
};

const getters = {
    getVacationRequests: state => state.vacationRequests
};

const mutations = {
    SET_VACATION_REQUESTS(state, vacationRequests) {
        state.vacationRequests = vacationRequests;
    }
};

const actions = {
    async fetchVacationRequests({ commit }) {
        const { data } = await axios.get('/vacationRequests');

        commit('SET_VACATION_REQUESTS', data);
    },

    async saveVacationRequest({ dispatch }, vacationRequest) {
        if (vacationRequest.id) {
            await axios.put(`/vacationRequests/${vacationRequest.id}`, vacationRequest);
        } else {
            await axios.post('/vacationRequests', vacationRequest);
        }

        dispatch('fetchVacationRequests');
        dispatch('fetchContracts');
    },

    async deleteVacationRequest({ dispatch }, id) {
        await axios.delete(`/vacationRequests/${id}`);

        dispatch('fetchVacationRequests');
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
