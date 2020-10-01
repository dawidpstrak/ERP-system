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
    },

    ADD_CONTRACT(state, newContract) {
        state.contracts.push(newContract);
    },

    UPDATE_CONTRACT(state, updatedContract) {
        const newState = state.contracts.filter(contract => contract.id !== updatedContract.id);

        newState.push(updatedContract);

        state.contracts = newState;
    },

    DELETE_CONTRACT(state, id) {
        state.contracts = state.contracts.filter(contract => contract.id !== id);
    }
};

export const actions = {
    async fetchContracts({ commit }) {
        const data = await this.$axios.$get('/contracts');

        commit('SET_CONTRACTS', data);
    },

    async saveContract({ commit }, contract) {
        if (contract.id) {
            const updatedContract = await this.$axios.$put(`/contracts/${contract.id}`, contract);

            commit('UPDATE_CONTRACT', updatedContract);
        } else {
            const newContract = await this.$axios.$post('/contracts', contract);

            commit('ADD_CONTRACT', newContract);
        }
    },

    async deleteContract({ commit }, id) {
        await this.$axios.delete(`/contracts/${id}`);

        commit('DELETE_CONTRACT', id);
    }
};
