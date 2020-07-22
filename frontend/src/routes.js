export const routes = [
    { path: '/', name: 'login', component: () => import('@/views/Login') },
    { path: '/dashboard', name: 'dashboard', component: () => import('@/views/Dashboard') }
];
