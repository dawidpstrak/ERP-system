<template>
    <v-container fluid>
        <v-container class="d-flex justify-center pa-3">
            <v-btn class="ma-2" tile outlined color="success" @click="openModal()">
                <v-icon left>mdi-plus</v-icon>employee
            </v-btn>
        </v-container>

        <v-data-table
            :headers="headers"
            :items="employees"
            :items-per-page="5"
            :mobile-breakpoint="990"
            :footer-props="footerProps"
            class="elevation-1"
            @click:row="openModal($event)"
        />

        <create-or-edit-employee v-if="showModal" :selectedItem="selectedItem" @closeModal="closeModal" />
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CreateOrEditEmployee from './CreateOrEditEmployee';

export default {
    components: { 'create-or-edit-employee': CreateOrEditEmployee },
    data() {
        return {
            headers: [
                { text: 'First name', align: 'center', value: 'firstName', sortable: false },
                { text: 'Last name', align: 'center', value: 'lastName', sortable: false },
                { text: 'Email', align: 'center', value: 'email', sortable: false },
                {
                    text: 'Available vacations',
                    align: 'center',
                    value: 'availableDaysOffAmount',
                    sortable: false
                },
                { text: 'Birth date', align: 'center', value: 'birthDate', sortable: false }
            ],
            footerProps: {
                itemsPerPageText: 'Employees per page'
            },
            showModal: false,
            selectedItem: null
        };
    },
    methods: {
        ...mapActions(['fetchEmployees']),
        openModal(selectedItem) {
            this.selectedItem = selectedItem;
            this.showModal = true;
        },

        closeModal() {
            this.selectedItem = null;
            this.showModal = false;
        }
    },
    computed: {
        ...mapGetters({ employees: 'getEmployees' })
    },
    created() {
        this.fetchEmployees();
    }
};
</script>
