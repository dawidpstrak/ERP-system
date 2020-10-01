<template>
    <v-container v-if="$auth.loggedIn" fluid class="pa-0  spacer">
        <v-container v-if="isAdmin" fluid class="pa-0 ma-0">
            <employees-list />
        </v-container>

        <v-container v-else fluid class="pa-0 ma-0">
            <employee-panel />
        </v-container>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    asyncData({ store }) {
        if (store.getters.isAdmin) {
            return store.dispatch('users/fetchUsers');
        } else {
            return Promise.all([
                store.dispatch('contracts/fetchContracts'),
                store.dispatch('vacationRequests/fetchVacationRequests')
            ]);
        }
    },

    computed: {
        ...mapGetters(['isAdmin'])
    }
};
</script>
