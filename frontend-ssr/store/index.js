import jwt from 'jsonwebtoken';

export const state = () => {};

export const getters = {
    isAdmin: state => state.auth.user.roles.some(role => role.name === 'admin')
};

export const actions = {
    async nuxtServerInit(vuexContext, { req }) {
        const cookies = req.headers.cookie;

        if (cookies && this.$auth.loggedIn) {
            const cookieToken = cookies.split(';').find(cookie => cookie.trim().startsWith('auth._token.local='));

            if (cookieToken) {
                // Reinit loggedUser to store after page refresh

                const token = cookieToken.split('%20')[1];

                const { loggedUser } = jwt.decode(token);

                this.$auth.setUser(loggedUser);
            }
        }
    },

    async renewLoggedUserData() {
        const user = await this.$axios.$get(`/me`);

        await this.$auth.setUser(user);
    }
};
