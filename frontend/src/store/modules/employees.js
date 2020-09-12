import axios from '@/plugins/axios';

const state = () => {
    return {
        employees: []
    };
};

const getters = {
    employees: state => state.employees
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

    async searchUsers(vuexContext, query) {
        const { data } = await axios.get('/users', query);

        return data;
    },

    async saveEmployee({ dispatch }, employee) {
        if (employee.id) {
            await axios.put(`/users/${employee.id}`, employee);
        } else {
            await axios.post('/users', employee);
        }

        dispatch('fetchEmployees');
    },

    async deleteEmployee({ dispatch }, id) {
        await axios.delete(`/users/${id}`);

        dispatch('fetchEmployees');
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
