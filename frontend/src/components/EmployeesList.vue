<template>
    <div>
        <h2>Your Employees ({{ employees.length }})</h2>
        <div class="employees-list-wrapper">
            <EmployeeCard v-for="employee in employees" :key="employee.id" :employee="employee" />
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import EmployeeCard from './EmployeeCard';

export default {
    components: {
        EmployeeCard
    },
    methods: {
        ...mapActions(['fetchEmployees'])
    },
    computed: {
        ...mapGetters({ employees: 'getEmployees' })
    },
    async created() {
        await this.fetchEmployees();
    }
};
</script>

<style scoped>
h2 {
    text-align: center;
    padding: 20px 0;
}

.employees-list-wrapper {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}
</style>
