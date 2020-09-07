import store from '../store/store';
import NotifyingService from '@/services/NotifyingService';

export const routes = [
    { path: '/', name: 'login', component: () => import('@/views/Login') },
    { path: '/dashboard', name: 'dashboard', component: () => import('@/views/Dashboard') },
    { path: '/contracts', name: 'contracts', component: () => import('@/views/Contracts') },
    { path: '/vacation-requests', name: 'employee', component: () => import('@/views/VacationRequests') },
    {
        path: '/logout',
        beforeEnter(to, from, next) {
            store.commit('REMOVE_USER_DATA');

            NotifyingService.loggedOut();

            next({ name: 'login' });
        }
    },
    { path: '*', redirect: '/dashboard' }
];
