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
        const { data } = await axios.get('/users');

        commit('SET_EMPLOYEES', data);
    },

    async saveEmployee({ dispatch }, employee) {
        employee.id ? await axios.put(`/users/${employee.id}`, employee) : await axios.post('/users', employee);

        dispatch('fetchEmployees');
    },

    async deleteEmployee({ dispatch }, employee) {
        await axios.delete(`/users/${employee.id}`, { data: { employee } });

        dispatch('fetchEmployees');
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
