import axios from '@/plugins/axios';

export const state = () => {
    return {
        employees: []
    };
};

export const getters = {
    employees: state => state.employees
};

export const mutations = {
    SET_EMPLOYEES(state, employees) {
        state.employees = employees;
    }
};

export const actions = {
    async fetchEmployees({ commit }) {
        const { data } = await this.$axios.get('/users');

        commit('SET_EMPLOYEES', data);
    },

    async searchUsers(vuexContext, query) {
        const { data } = await this.$axios.get('/users', { params: { query } });

        return data;
    },

    async saveEmployee({ dispatch }, employee) {
        if (employee.id) {
            await this.$axios.put(`/users/${employee.id}`, employee);
        } else {
            await this.$axios.post('/users', employee);
        }

        dispatch('fetchEmployees');
    },

    async deleteEmployee({ dispatch }, id) {
        await this.$axios.delete(`/users/${id}`);

        dispatch('fetchEmployees');
    }
};
