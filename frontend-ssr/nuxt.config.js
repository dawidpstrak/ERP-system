export default {
    head: {
        titleTemplate: '%s - erpsystem-ssr',
        title: 'erpsystem-ssr',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },

    css: ['@/assets/main.scss'],

    plugins: [
        { src: '~/plugins/axios.js' },
        { src: '~/plugins/notifications-ssr.js', mode: 'server' },
        { src: '~/plugins/notifications-client.js', mode: 'client' }
    ],

    components: true,

    buildModules: ['@nuxtjs/vuetify'],

    modules: ['@nuxtjs/axios'],

    build: {
        extend: config => {
            config.node = {
                fs: 'empty' // workaround for dotenv fs dependency not found
            };
        }
    }
};
