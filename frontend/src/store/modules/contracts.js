import axios from '@/plugins/axios';

const state = () => {
    return {
        contracts: []
    };
};

const getters = {
    contracts: state => state.contracts
};

const mutations = {
    SET_CONTRACTS(state, contracts) {
        state.contracts = contracts;
    }
};

const actions = {
    async fetchContracts({ commit }) {
        const { data } = await axios.get('/contracts');

        commit('SET_CONTRACTS', data);
    },

    async saveContract({ dispatch }, contract) {
        if (contract.id) {
            await axios.put(`/contracts/${contract.id}`, contract);
        } else {
            await axios.post('/contracts', contract);
        }

        dispatch('fetchContracts');
    },

    async deleteContract({ dispatch }, id) {
        await axios.delete(`/contracts/${id}`);

        dispatch('fetchContracts');
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
