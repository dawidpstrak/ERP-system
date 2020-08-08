<template>
    <div v-if="loggedUser && loggedUser.role.name === 'admin'" class="admin-dashboard">
        <EmployeesList />
    </div>
    <div v-else>User Dashboard Todo</div>
</template>

<script>
import { mapGetters } from 'vuex';
import EmployeesList from '../components/EmployeesList';

export default {
    components: { EmployeesList },
    computed: {
        ...mapGetters(['loggedUser'])
    }
};
</script>

<style scoped>
.admin-dashboard {
    width: 100%;
}
</style>
