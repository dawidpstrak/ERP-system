import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import store from './store/store';
import router from './router/router';

Vue.use(Vuetify);

new Vue({
    router,
    store,
    vuetify: new Vuetify(),
    render: h => h(App)
}).$mount('#app');
