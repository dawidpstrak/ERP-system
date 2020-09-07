<template>
    <v-app>
        <Sidebar v-if="$route.path !== '/'" />
        <router-view />
        <notifications />
    </v-app>
</template>

<script>
import Sidebar from './components/Sidebar';
import { mapGetters } from 'vuex';

export default {
    name: 'App',
    components: {
        Sidebar
    },
    computed: {
        ...mapGetters(['getLoggedUser'])
    }
};
</script>

<style>
#app .v-application--wrap {
    flex-direction: row;
}
</style>
