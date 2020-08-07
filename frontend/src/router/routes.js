import store from '../store/store';

export const routes = [
    { path: '/', name: 'login', component: () => import('@/views/Login') },
    { path: '/dashboard', name: 'dashboard', component: () => import('@/views/Dashboard') },
    { path: '/vacations', name: 'vacation', component: () => import('@/views/Vacation') },
    { path: '/employees', name: 'employee', component: () => import('@/views/Employee') },
    {
        path: '/logout',
        beforeEnter(to, from, next) {
            store.commit('logout');
            next({ name: 'login' });
        }
    },
    { path: '*', redirect: '/' }
];
