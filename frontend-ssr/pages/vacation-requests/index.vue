<template>
    <v-container class="spacer" fluid>
        <v-card>
            <v-card class="d-flex align-center justify-space-between" outlined>
                <v-card-title class="ml-6">Vacation requests</v-card-title>
                <v-btn class="mr-6" outlined color="primary" data-cy="add-vacation-button" @click="openCreateOrEdit()">
                    <v-icon left>mdi-plus</v-icon>Vacation Requests
                </v-btn>
            </v-card>

            <v-data-table
                :headers="vacationRequestsProps.headers"
                :items="vacationRequests"
                :items-per-page="5"
                :mobile-breakpoint="990"
                :footer-props="vacationRequestsProps.footer"
                :sort-by="'startDate'"
                data-cy="vacations-list"
                class="elevation-1"
            >
                <template v-slot:item.actions="{ item }">
                    <v-icon small color="primary" class="mr-2" @click="openCreateOrEdit(item)">mdi-pencil</v-icon>
                    <v-icon small color="error" @click="openConfirmDelete(item)">mdi-delete</v-icon>
                </template>
            </v-data-table>

            <create-or-edit-vacation-request
                v-if="showCreateOrEditModal"
                :showCreateOrEditModal="showCreateOrEditModal"
                :selectedItem="selectedItem"
                @closeModal="closeCreateOrEdit()"
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
import NotificationService from '@/services/NotificationService';

import { mapActions, mapGetters } from 'vuex';

export default {
    asyncData({ store }) {
        return store.dispatch('vacationRequests/fetchVacationRequests');
    },

    data() {
        return {
            vacationRequestsProps: {
                headers: [
                    { text: 'Employee Name', align: 'center', value: 'user.firstName', sortable: false },
                    { text: 'Employee surname', align: 'center', value: 'user.lastName', sortable: false },
                    { text: 'Vacation start', align: 'center', value: 'startDate', sortable: false },
                    { text: 'Vacation end', align: 'center', value: 'endDate', sortable: false },
                    { text: 'Requested days off', align: 'center', value: 'requestedDaysOff', sortable: false },
                    { text: 'Status', align: 'center', value: 'status', sortable: false },
                    { text: 'Actions', value: 'actions', sortable: false }
                ],
                footer: {
                    itemsPerPageText: 'Vacation requests per page'
                }
            },
            showCreateOrEditModal: false,
            showConfirmDelete: false,
            selectedItem: null,
            vacationRequestToDeleteId: null,
            resourceName: 'vacation request'
        };
    },

    computed: {
        ...mapGetters({ vacationRequests: 'vacationRequests/vacationRequests' })
    },

    methods: {
        ...mapActions({ deleteVacationRequest: 'vacationRequests/deleteVacationRequest' }),

        openCreateOrEdit(selectedItem = null) {
            this.selectedItem = selectedItem;
            this.showCreateOrEditModal = true;
        },

        closeCreateOrEdit() {
            this.selectedItem = null;
            this.showCreateOrEditModal = false;
        },

        openConfirmDelete(vacationRequest) {
            this.vacationRequestToDeleteId = vacationRequest.id;
            this.showConfirmDelete = true;
        },

        async onDelete() {
            try {
                await this.deleteVacationRequest(this.vacationRequestToDeleteId);

                this.vacationRequestToDeleteId = null;
                this.showConfirmDelete = false;

                NotificationService.deleted(this.resourceName);
            } catch (error) {
                NotificationService.handleError(error);

                console.error(error);
            }
        }
    }
};
</script>
