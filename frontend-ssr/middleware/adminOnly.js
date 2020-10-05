export default function({ store, redirect, route }) {
    const adminRoutes = ['/contracts', '/vacation-requests'];
    const home = '/dashboard';

    if (adminRoutes.includes(route.path) && !store.getters.isAdmin) {
        return redirect(home);
    }
}
