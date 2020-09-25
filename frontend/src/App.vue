<template>
    <v-app>
        <Sidebar v-if="loggedUser" />

        <transition name="fade" mode="out-in">
            <router-view />
        </transition>

        <notifications
            classes="vue-notification"
            position="bottom center"
            :duration="5000"
            :ignoreDuplicates="true"
            :max="1"
        />
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
        ...mapGetters(['loggedUser'])
    }
};
</script>
