<template>
    <v-container fluid class="pa-0 ma-0">
        <v-container class="d-flex justify-center"
            >Available vacation days : {{ loggedUser.availableDaysOffAmount }}</v-container
        >
        <h2>Your contracts</h2>
        <v-container fluid>
            <v-data-table
                :headers="contractsProps.headers"
                :items="contracts"
                :items-per-page="5"
                :mobile-breakpoint="990"
                :footer-props="contractsProps.footer"
                :sort-by="'startDate'"
                class="elevation-1"
            />
        </v-container>

        <h2>Your vacation requests</h2>

        <v-container class="d-flex justify-center">
            <v-btn class="ma-2" tile outlined color="success" @click="openModal()">
                <v-icon left>mdi-plus</v-icon>vacation request
            </v-btn>
        </v-container>

        <v-container fluid>
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
        </v-container>

        <CreateOrEditVacationRequest v-if="showModal" :selectedItem="selectedItem" @closeModal="closeModal" />
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CreateOrEditVacationRequest from '../components/CreateOrEditVacationRequest';

export default {
    components: {
        CreateOrEditVacationRequest
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
        ...mapGetters({ loggedUser: 'loggedUser', contracts: 'getContracts', vacationRequests: 'getVacationRequests' })
    },
    methods: {
        ...mapActions(['fetchContracts', 'fetchVacationRequests']),

        openModal(selectedItem) {
            if (this.canBeOpened(selectedItem)) {
                this.selectedItem = selectedItem;
                this.showModal = true;
            }
        },

        closeModal() {
            this.selectedItem = null;
            this.showModal = false;
        },

        canBeOpened(selectedItem) {
            return !selectedItem || selectedItem.status === 'pending';
        }
    },
    created() {
        Promise.all([this.fetchContracts(), this.fetchVacationRequests()]);
    }
};
</script>

<style lang="scss" scoped>
h2 {
    text-align: center;
    padding: 20px;
}
</style>
