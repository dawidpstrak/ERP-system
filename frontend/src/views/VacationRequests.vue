<template>
    <v-container fluid>
        <v-container class="d-flex justify-center pa-3">
            <v-btn class="ma-2" tile outlined color="success" @click="openModal()">
                <v-icon left>mdi-plus</v-icon>Vacation Requests
            </v-btn>
        </v-container>

        <v-data-table
            :headers="vacationRequestsProps.headers"
            :items="vacationRequests"
            :items-per-page="5"
            :mobile-breakpoint="990"
            :footer-props="vacationRequestsProps.footer"
            :sort-by="'startDate'"
            class="elevation-1"
            @click:row="openModal($event)"
        />

        <create-or-edit-vacation-request v-if="showModal" :selected-item="selectedItem" @closeModal="closeModal" />
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
                    { text: 'Status', align: 'center', value: 'status', sortable: false }
                ],
                footer: {
                    itemsPerPageText: 'Vacation requests per page'
                }
            },
            showModal: false,
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
            this.showModal = true;
            this.selectedItem = selectedItem;
        },
        closeModal() {
            this.showModal = false;
            this.selectedItem = null;
        }
    }
};
</script>
