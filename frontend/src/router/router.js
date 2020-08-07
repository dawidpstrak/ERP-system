import Vue from 'vue';
import VueRouter from 'vue-router';

import { routes } from './routes';
import store from '@/store/store';

Vue.use(VueRouter);

const router = new VueRouter({
    routes,
    mode: 'history'
});

router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && !store.getters.loggedUser) {
        // Redirect to login page when user is not logged in and try handly navigate to routes

        next({ name: 'login' });
    } else if (to.name === 'login' && store.getters.loggedUser) {
        // Redirect to dashboard page when user is logged in and try handly navigate to /login route

        next({ name: 'dashboard' });
    }

    next();
});

export default router;
