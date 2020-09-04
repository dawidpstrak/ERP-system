<template>
    <v-container fluid>
        <v-container class="d-flex justify-center pa-3">
            <v-btn class="ma-2" tile outlined color="success" @click="openModal()">
                <v-icon left>mdi-plus</v-icon>contract
            </v-btn>
        </v-container>

        <v-data-table
            :headers="headers"
            :items="contracts"
            :items-per-page="5"
            :mobile-breakpoint="990"
            :footer-props="footerProps"
            class="elevation-1"
            @click:row="openModal($event)"
        />

        <create-or-edit-contract v-if="showModal" :selectedItem="selectedItem" @closeModal="closeModal" />
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
                { text: 'Name', align: 'center', value: 'user.name', sortable: false },
                { text: 'Surname', align: 'center', value: 'user.surname', sortable: false },
                { text: 'Start date', align: 'center', value: 'startDate', sortable: false },
                { text: 'End date', align: 'center', value: 'endDate', sortable: false },
                { text: 'Duration', align: 'center', value: 'duration', sortable: false },
                { text: 'Available days off', align: 'center', value: 'availableDaysOffAmount', sortable: false }
            ],
            footerProps: {
                itemsPerPageText: 'Contracts per page'
            },
            showModal: false,
            selectedItem: null
        };
    },
    computed: {
        ...mapGetters({ contracts: 'getContracts' })
    },
    methods: {
        ...mapActions(['fetchContracts']),
        openModal(selectedItem) {
            this.showModal = true;
            this.selectedItem = selectedItem;
        },
        closeModal() {
            this.showModal = false;
            this.selectedItem = null;
        }
    },
    created() {
        this.fetchContracts();
    }
};
</script>
