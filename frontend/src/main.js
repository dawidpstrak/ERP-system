import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import { routes } from './routes';

Vue.use(VueRouter);
Vue.use(Vuetify);

const router = new VueRouter({
    routes,
    mode: 'history'
});

new Vue({
    router,
    vuetify: new Vuetify(),
    render: h => h(App)
}).$mount('#app');
