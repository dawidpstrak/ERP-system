<template>
    <v-navigation-drawer :mobile-breakpoint="null" width="200" absolute :mini-variant="showMiniVariant">
        <v-list-item class="mobile-display-none">
            <v-list-item-content class="pa-3">
                <v-list-item-title class="title" align="center">ERP SYSTEM</v-list-item-title>
                <v-list-item-subtitle v-if="$auth.user" align="center">
                    <strong>{{ $auth.user.email }}</strong>
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list dense nav>
            <nuxt-link
                v-for="link in linksByRole"
                :key="link.title"
                :to="link.to"
                align="center"
                :data-cy="link.data"
                class="text-decoration-none"
            >
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon>{{ link.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="mr-0">
                        <v-list-item-title>{{ link.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </nuxt-link>

            <v-list-item link data-cy="nav-logout" class="text-decoration-none" @click="$auth.logout()">
                <v-list-item-icon>
                    <v-icon>{{ 'mdi-logout-variant' }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title align="center">LOGOUT</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            showMiniVariant: false,
            breakpointWidth: 700
        };
    },

    computed: {
        ...mapGetters(['isAdmin']),

        linksByRole() {
            if (!this.$auth.user.roles) {
                return [];
            }

            const userLinks = [
                { title: 'DASHBOARD', icon: 'mdi-view-dashboard-outline', to: '/dashboard', data: 'nav-dashboard' }
            ];
            const adminLinks = [
                ...userLinks,
                { title: 'CONTRACTS', icon: 'mdi-account-clock-outline ', to: '/contracts', data: 'nav-contracts' },
                { title: 'VACATIONS', icon: 'mdi-hail', to: '/vacation-requests', data: 'nav-vacations' }
            ];

            return this.isAdmin ? adminLinks : userLinks;
        }
    },

    created() {
        if (process.browser) {
            this.showMiniVariant = window.screen.width <= this.breakpointWidth;

            window.addEventListener('resize', () => {
                this.showMiniVariant = window.screen.width <= this.breakpointWidth;
            });
        }
    }
};
</script>
