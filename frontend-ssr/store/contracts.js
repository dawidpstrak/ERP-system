export const state = () => {
    return {
        contracts: []
    };
};

export const getters = {
    contracts: state => state.contracts
};

export const mutations = {
    SET_CONTRACTS(state, contracts) {
        state.contracts = contracts;
    }
};

export const actions = {
    async fetchContracts({ commit }) {
        const data = await this.$axios.$get('/contracts');

        commit('SET_CONTRACTS', data);
    },

    async saveContract({ dispatch }, contract) {
        if (contract.id) {
            await this.$axios.put(`/contracts/${contract.id}`, contract);
        } else {
            await this.$axios.post('/contracts', contract);
        }

        //TODO not needed dispatch just update existing array
        dispatch('fetchContracts');
    },

    async deleteContract({ dispatch }, id) {
        await this.$axios.delete(`/contracts/${id}`);

        //TODO not needed dispatch just update existing array
        dispatch('fetchContracts');
    }
};
