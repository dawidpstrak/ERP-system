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
    },
    async saveEmployee({ dispatch }, employee) {
        if (employee.id) {
            await axios.put(`/employees/${employee.id}`, employee);
        } else {
            await axios.post('/employees', employee);
        }

        dispatch('fetchEmployees');
    },
    async deleteEmployee({ dispatch }, id) {
        await axios.delete(`/employees/${id}`);

        dispatch('fetchEmployees');
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
