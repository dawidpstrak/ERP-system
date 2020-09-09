<template>
    <v-container v-if="loggedUser" fluid class="pa-0  spacer">
        <v-container v-if="isAdmin" fluid class="pa-0 ma-0">
            <EmployeesList />
        </v-container>

        <v-container v-else fluid class="pa-0 ma-0">
            <EmployeePanel />
        </v-container>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

import EmployeesList from '@/components/EmployeesList';
import EmployeePanel from '@/components/EmployeePanel';

export default {
    components: { EmployeesList, EmployeePanel },
    computed: {
        ...mapGetters(['loggedUser', 'isAdmin'])
    }
};
</script>
