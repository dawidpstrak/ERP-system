<template>
    <div class="employee-card-wrapper">
        <h3>{{ employee.name }} {{ employee.surname }}</h3>
        <p>{{ employee.email }}</p>
        <p>total vacations: 20</p>
    </div>
</template>

<script>
export default {
    props: {
        employee: Object
    }
};
</script>

<style scoped>
.employee-card-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 300px;
    margin: 20px;
    border: 1px solid grey;
    height: 250px;
}

h3 {
    text-align: center;
    margin: 20px 0;
}

p {
    text-align: center;
    margin: 20px 0;
}
</style>
