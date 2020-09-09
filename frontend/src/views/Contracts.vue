<template>
    <v-container class="spacer" fluid>
        <v-card>
            <v-card class="d-flex align-center justify-space-between" outlined>
                <v-card-title class="ml-6">Contracts</v-card-title>
                <v-btn class="mr-6" outlined color="primary" @click="openModal()">
                    <v-icon left>mdi-plus</v-icon>contract
                </v-btn>
            </v-card>

            <v-data-table
                :headers="headers"
                :items="contracts"
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

            <create-or-edit-contract
                v-if="isShown"
                :isShown="isShown"
                :selectedItem="selectedItem"
                @closeModal="closeModal"
            />
        </v-card>
    </v-container>
</template>

<script>
import CreateOrEditContract from '../components/CreateOrEditContract';
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
        'create-or-edit-contract': CreateOrEditContract
    },
    data() {
        return {
            headers: [
                { text: 'Name', align: 'center', value: 'user.firstName', sortable: false },
                { text: 'Surname', align: 'center', value: 'user.lastName', sortable: false },
                { text: 'Start date', align: 'center', value: 'startDate', sortable: false },
                { text: 'End date', align: 'center', value: 'endDate', sortable: false },
                { text: 'Duration', align: 'center', value: 'duration', sortable: false },
                { text: 'Available days off', align: 'center', value: 'availableDaysOffAmount', sortable: false },
                { text: 'Actions', value: 'actions', sortable: false }
            ],
            footerProps: {
                itemsPerPageText: 'Contracts per page'
            },
            isShown: false,
            selectedItem: null
        };
    },
    computed: {
        ...mapGetters({ contracts: 'getContracts' })
    },
    methods: {
        ...mapActions(['fetchContracts']),
        openModal(selectedItem) {
            this.isShown = true;
            this.selectedItem = selectedItem;
        },
        closeModal() {
            this.isShown = false;
            this.selectedItem = null;
        }
    },
    created() {
        this.fetchContracts();
    }
};
</script>
