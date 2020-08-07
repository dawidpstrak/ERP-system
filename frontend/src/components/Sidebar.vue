<template>
    <v-card>
        <v-navigation-drawer width="230" height="100vh" permanent>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title padding">ERP SYSTEM</v-list-item-title>
                    <v-list-item-subtitle v-if="loggedUser">
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
                    class="link"
                >
                    <v-list-item link>
                        <v-list-item-icon>
                            <v-icon>{{ link.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{ link.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </router-link>
                <router-link to="/logout" class="link">
                    <v-list-item link>
                        <v-list-item-icon>
                            <v-icon>{{ 'mdi-logout-variant' }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>LOGOUT</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </router-link>
            </v-list>
        </v-navigation-drawer>
    </v-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
    methods: {
        ...mapMutations(['logout'])
    },
    computed: {
        ...mapGetters(['loggedUser']),
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

            return this.loggedUser.roles.name === 'admin' ? adminLinks : userLinks;
        }
    }
};
</script>

<style scoped>
.padding {
    padding: 10px 0;
}
.link {
    text-decoration: none;
}
</style>
