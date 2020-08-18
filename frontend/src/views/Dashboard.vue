<template>
    <v-container fluid class="pa-0 ma-0">
        <v-container v-if="loggedUser && isAdmin" fluid class="pa-0 ma-0">
            <EmployeesList />
        </v-container>

        <v-container v-else>User Dashboard Todo</v-container>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

import EmployeesList from '../components/EmployeesList';

export default {
    components: { EmployeesList },
    computed: {
        ...mapGetters(['loggedUser', 'isAdmin'])
    }
};
</script>
