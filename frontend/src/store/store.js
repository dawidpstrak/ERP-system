import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import employees from './modules/employees';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        auth,
        employees
    }
});
