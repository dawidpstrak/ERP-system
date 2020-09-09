<template>
    <v-container class="spacer" fluid>
        <v-card>
            <v-card class="d-flex align-center justify-space-between" outlined>
                <v-card-title class="ml-6">Vacation requests</v-card-title>
                <v-btn class="mr-6" outlined color="primary" @click="openModal()">
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
                class="elevation-1"
            >
                <template v-slot:item.actions="{ item }">
                    <v-icon small color="primary" class="mr-2" @click="openModal(item)">mdi-pencil</v-icon>
                    <v-icon small color="error">mdi-delete</v-icon>
                </template>
            </v-data-table>

            <create-or-edit-vacation-request
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
import CreateOrEditVacationRequest from '@/components/CreateOrEditVacationRequest.vue';

export default {
    components: {
        'create-or-edit-vacation-request': CreateOrEditVacationRequest
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
            isShown: false,
            selectedItem: null
        };
    },
    computed: {
        ...mapGetters({ vacationRequests: 'getVacationRequests' })
    },
    created() {
        this.fetchVacationRequests();
    },
    methods: {
        ...mapActions(['fetchVacationRequests']),
        openModal(selectedItem) {
            this.isShown = true;
            this.selectedItem = selectedItem;
        },
        closeModal() {
            this.isShown = false;
            this.selectedItem = null;
        }
    }
};
</script>
