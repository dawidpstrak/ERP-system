<template>
    <v-card>
        <v-navigation-drawer width="200" height="100vh" permanent>
            <v-list-item>
                <v-list-item-content class="pa-3">
                    <v-list-item-title class="title" align="center">ERP SYSTEM</v-list-item-title>
                    <v-list-item-subtitle v-if="loggedUser" align="center">
                        <strong>{{ loggedUser.email }}</strong>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list dense nav>
                <router-link
                    v-for="link in linksByRole"
                    :key="link.title"
                    :to="link.to"
                    align="center"
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
                </router-link>
                <router-link to="/logout" class="text-decoration-none">
                    <v-list-item link>
                        <v-list-item-icon>
                            <v-icon>{{ 'mdi-logout-variant' }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title align="center">LOGOUT</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </router-link>
            </v-list>
        </v-navigation-drawer>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters(['loggedUser', 'isAdmin']),
        linksByRole() {
            if (!this.loggedUser) {
                return [];
            }

            const userLinks = [{ title: 'DASHBOARD', icon: 'mdi-view-dashboard-outline', to: '/dashboard' }];
            const adminLinks = [
                ...userLinks,
                { title: 'VACATIONS', icon: 'mdi-palm-tree ', to: '/vacations' },
                { title: 'EMPLOYEE', icon: 'mdi-human', to: '/employees' }
            ];

            return this.isAdmin ? adminLinks : userLinks;
        }
    }
};
</script>

<style scoped>
.router-link-active {
    background-color: #2b80d5;
}
.v-list-item {
    background-color: inherit;
}
</style>
