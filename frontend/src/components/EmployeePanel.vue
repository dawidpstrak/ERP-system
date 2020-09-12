<template>
    <v-container fluid class="pa-0 ma-0">
        <v-container fluid>
            <v-card>
                <v-card outlined>
                    <v-card-title class="ml-6">Your contracts</v-card-title>
                </v-card>
                <v-data-table
                    :headers="contractsProps.headers"
                    :items="contracts"
                    :items-per-page="5"
                    :mobile-breakpoint="990"
                    :footer-props="contractsProps.footer"
                    :sort-by="'startDate'"
                    class="elevation-1"
                />
            </v-card>
        </v-container>

        <v-container fluid>
            <v-card>
                <v-card class="d-flex align-center justify-space-between" outlined>
                    <v-card-title class="ml-6"
                        >Your vacations ({{ loggedUser.availableDaysOffAmount }} available days)</v-card-title
                    >
                    <v-btn class="mr-6" outlined color="primary" @click="openCreateOrEdit()">
                        <v-icon left>mdi-plus</v-icon>vacation
                    </v-btn>
                </v-card>
                <v-data-table
                    :headers="vacationRequestsProps.headers"
                    :items="vacationRequests"
                    :items-per-page="5"
                    :mobile-breakpoint="990"
                    :footer-props="vacationRequestsProps.footer"
                    :sort-by="'startDate'"
                    class="elevation-1"
                >
                    <template v-slot:item.actions="{ item }">
                        <v-icon small color="primary" class="mr-2" @click="openCreateOrEdit(item)">mdi-pencil</v-icon>
                        <v-icon small color="error" @click="openConfirmDelete(item)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-card>
        </v-container>

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
    </v-container>
</template>

<script>
import CreateOrEditVacationRequest from '../components/CreateOrEditVacationRequest';
import NotyfyingService from '@/services/NotifyingService';
import ConfirmDelete from '@/components/ConfirmDelete';

import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
        'create-or-edit-vacation-request': CreateOrEditVacationRequest,
        'confirm-delete': ConfirmDelete
    },
    data() {
        return {
            contractsProps: {
                headers: [
                    { text: 'Start date', align: 'center', value: 'startDate', sortable: false },
                    { text: 'End date', align: 'center', value: 'endDate', sortable: false },
                    { text: 'Duration/months', align: 'center', value: 'duration', sortable: false },
                    { text: 'Available days off', align: 'center', value: 'availableDaysOffAmount', sortable: false }
                ],
                footer: {
                    itemsPerPageText: 'Contracts per page'
                }
            },

            vacationRequestsProps: {
                headers: [
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
            vacationRequestToDeleteId: null,
            selectedItem: null,
            resourceName: 'vacation request'
        };
    },
    computed: {
        ...mapGetters(['loggedUser', 'contracts', 'vacationRequests'])
    },
    methods: {
        ...mapActions(['fetchContracts', 'fetchVacationRequests', 'deleteVacationRequest']),

        openCreateOrEdit(selectedItem = null) {
            if (this.canBeEdited(selectedItem)) {
                this.selectedItem = selectedItem;
                this.showCreateOrEditModal = true;
            } else {
                NotyfyingService.noAccessRights();
            }
        },

        closeCreateOrEdit() {
            this.selectedItem = null;
            this.showCreateOrEditModal = false;
        },

        openConfirmDelete(vacationRequest) {
            if (this.canBeDeleted(vacationRequest)) {
                this.vacationRequestToDeleteId = vacationRequest.id;
                this.showConfirmDelete = true;
            } else {
                NotyfyingService.noAccessRights();
            }
        },

        canBeEdited(selectedItem) {
            // !selectedItem mean that user clicked on new vacation request button

            return !selectedItem || selectedItem.status === 'pending';
        },

        canBeDeleted(vacationRequest) {
            return vacationRequest.status === 'pending';
        },

        async onDelete() {
            try {
                await this.deleteVacationRequest(this.vacationRequestToDeleteId);

                this.vacationRequestToDeleteId = null;
                this.showConfirmDelete = false;

                NotyfyingService.deleted(this.resourceName);
            } catch (error) {
                NotyfyingService.handleError(error);

                console.error(error);
            }
        }
    },
    created() {
        Promise.all([this.fetchContracts(), this.fetchVacationRequests()]);
    }
};
</script>
