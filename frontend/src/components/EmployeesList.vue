<template>
    <v-container fluid>
        <v-card>
            <v-card class="d-flex align-center justify-space-between" outlined>
                <v-card-title class="ml-6">Employees</v-card-title>
                <v-btn outlined color="primary" class="mr-6" @click="openModal()">
                    <v-icon left>mdi-plus</v-icon>employee
                </v-btn>
            </v-card>
            <v-data-table
                :headers="headers"
                :items="employees"
                :items-per-page="5"
                :mobile-breakpoint="990"
                :footer-props="footerProps"
                class="elevation-1"
            >
                <template v-slot:item.actions="{ item }">
                    <v-icon small color="primary" class="mr-2" @click="openModal(item)">mdi-pencil</v-icon>
                    <v-icon small color="error">mdi-delete</v-icon>
                </template>
            </v-data-table>

            <create-or-edit-employee
                v-if="isShown"
                :isShown="isShown"
                :selectedItem="selectedItem"
                @closeModal="closeModal"
            />
        </v-card>
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
                { text: 'Birth date', align: 'center', value: 'birthDate', sortable: false },
                { text: 'Actions', value: 'actions', sortable: false }
            ],
            footerProps: {
                itemsPerPageText: 'Employees per page'
            },
            isShown: false,
            selectedItem: null
        };
    },
    methods: {
        ...mapActions(['fetchEmployees']),
        openModal(selectedItem) {
            this.selectedItem = selectedItem;
            this.isShown = true;
        },

        closeModal() {
            this.selectedItem = null;
            this.isShown = false;
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
