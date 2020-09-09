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
            width="400"
            :ignoreDuplicates="true"
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

<style lang="scss">
#app .v-application--wrap {
    flex-direction: row;
    .spacer {
        // place for navigation with absolute position
        margin-left: 200px;
    }
}

.fade-enter {
    opacity: 0;
}

.fade-enter-active {
    transition: opacity 0.3s;
}

.fade-leave-active {
    transition: opacity 0.3s;
    opacity: 0;
}

.vue-notification {
    height: 90px;

    .notification-title {
        font-size: 17px;
    }
    .notification-content {
        font-size: 13px;
    }
}
</style>
