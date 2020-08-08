import axios from '@/plugins/axios';

const state = () => {
    return {
        employees: []
    };
};

const getters = {
    getEmployees: state => state.employees
};

const mutations = {
    SET_EMPLOYEES(state, employees) {
        state.employees = employees;
    }
};

const actions = {
    async fetchEmployees({ commit }) {
        const { data } = await axios.get('employees');
        commit('SET_EMPLOYEES', data);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
