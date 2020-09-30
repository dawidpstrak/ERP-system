<template>
    <v-container fluid>
        <v-card>
            <v-card class="d-flex align-center justify-space-between" outlined>
                <v-card-title class="ml-6">Employees</v-card-title>
                <v-btn outlined color="primary" class="mr-6" data-cy="add-employee-button" @click="openCreateOrEdit()">
                    <v-icon left>mdi-plus</v-icon>employee
                </v-btn>
            </v-card>
            <v-data-table
                :headers="headers"
                :items="users"
                :items-per-page="5"
                :mobile-breakpoint="990"
                :footer-props="footerProps"
                data-cy="employee-list"
                class="elevation-1"
            >
                <template v-slot:item.actions="{ item }">
                    <v-icon small color="primary" class="mr-2" @click="openCreateOrEdit(item)">mdi-pencil</v-icon>
                    <v-icon small color="error" @click="openConfirmDelete(item)">mdi-delete</v-icon>
                </template>
            </v-data-table>

            <create-or-edit-employee
                v-if="showCreateOrEditModal"
                :showCreateOrEditModal="showCreateOrEditModal"
                :selectedItem="selectedItem"
                @closeModal="closeCreateOrEdit"
            />

            <confirm-delete
                v-if="showConfirmDelete"
                :resourceName="resourceName"
                :showConfirmDelete="showConfirmDelete"
                @canceled="showConfirmDelete = false"
                @confirmed="onDelete"
            />
        </v-card>
    </v-container>
</template>

<script>
import NotyficationService from '@/services/NotificationService';

import { mapActions, mapGetters } from 'vuex';

export default {
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
            resourceName: 'user',
            showCreateOrEditModal: false,
            showConfirmDelete: false,
            selectedItem: null,
            employeeToDeleteId: null
        };
    },
    methods: {
        ...mapActions({ fetchUsers: 'users/fetchUsers', deleteUser: 'users/deleteUser' }),

        openCreateOrEdit(selectedItem = null) {
            this.selectedItem = selectedItem;
            this.showCreateOrEditModal = true;
        },

        closeCreateOrEdit() {
            this.selectedItem = null;
            this.showCreateOrEditModal = false;
        },

        openConfirmDelete(employee) {
            this.employeeToDeleteId = employee.id;
            this.showConfirmDelete = true;
        },

        async onDelete() {
            try {
                await this.deleteUser(this.employeeToDeleteId);

                this.employeeToDeleteId = null;
                this.showConfirmDelete = false;

                NotyficationService.deleted(this.resourceName);
            } catch (error) {
                NotyficationService.handleError(error);

                console.error(error);
            }
        }
    },
    computed: {
        ...mapGetters({ users: 'users/users' })
    },
    created() {
        this.fetchUsers();
    }
};
</script>
