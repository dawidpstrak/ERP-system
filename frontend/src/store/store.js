import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import employees from './modules/employees';
import contracts from './modules/contracts';
import vacationRequests from './modules/vacationRequests';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        auth,
        employees,
        contracts,
        vacationRequests
    }
});
