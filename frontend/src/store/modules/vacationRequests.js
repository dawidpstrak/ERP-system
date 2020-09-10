import axios from '@/plugins/axios';

const state = () => {
    return {
        vacationRequests: []
    };
};

const getters = {
    vacationRequests: state => state.vacationRequests
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
        dispatch('renewLoggedUserData');
    },

    async deleteVacationRequest({ dispatch }, id) {
        await axios.delete(`/vacationRequests/${id}`);

        dispatch('fetchVacationRequests');
        dispatch('renewLoggedUserData');
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
