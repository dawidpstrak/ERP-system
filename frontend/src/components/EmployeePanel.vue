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
                    <v-card-title
                        class="ml-6"
                    >Your vacations ({{ loggedUser.availableDaysOffAmount }} days left)</v-card-title>
                    <v-btn class="mr-6" outlined color="primary" @click="openModal()">
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
                        <v-icon
                            small
                            color="primary"
                            class="mr-2"
                            @click="openModal(item)"
                        >mdi-pencil</v-icon>
                        <v-icon small color="error">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-card>
        </v-container>

        <CreateOrEditVacationRequest
            v-if="isShown"
            :isShown="isShown"
            :selectedItem="selectedItem"
            @closeModal="closeModal"
        />
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
        ...mapGetters({ loggedUser: 'loggedUser', contracts: 'getContracts', vacationRequests: 'getVacationRequests' })
    },
    methods: {
        ...mapActions(['fetchContracts', 'fetchVacationRequests']),

        openModal(selectedItem) {
            if (this.canBeOpened(selectedItem)) {
                this.selectedItem = selectedItem;
                this.isShown = true;
            }
        },

        closeModal() {
            this.selectedItem = null;
            this.isShown = false;
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
