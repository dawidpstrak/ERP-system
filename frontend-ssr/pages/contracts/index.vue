<template>
    <v-container class="spacer" fluid>
        <v-card>
            <v-card class="d-flex align-center justify-space-between" outlined>
                <v-card-title class="ml-6">Contracts</v-card-title>
                <v-btn class="mr-6" outlined color="primary" data-cy="add-contract-button" @click="openCreateOrEdit()">
                    <v-icon left>mdi-plus</v-icon>contract
                </v-btn>
            </v-card>

            <v-data-table
                :headers="headers"
                :items="contracts"
                :items-per-page="5"
                :mobile-breakpoint="990"
                :footer-props="footerProps"
                data-cy="contracts-list"
                class="elevation-1"
            >
                <template v-slot:item.actions="{ item }">
                    <v-icon small color="primary" class="mr-2" @click="openCreateOrEdit(item)">mdi-pencil</v-icon>
                    <v-icon small color="error" @click="openConfirmDelete(item)">mdi-delete</v-icon>
                </template>
            </v-data-table>

            <create-or-edit-contract
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
import NotificationService from '@/services/NotificationService';

import { mapGetters, mapActions } from 'vuex';

export default {
    asyncData({ store }) {
        try {
            return store.dispatch('contracts/fetchContracts');
        } catch (error) {
            process.client && NotificationService(error);

            console.error(error);
        }
    },

    data() {
        return {
            headers: [
                { text: 'Employee name', align: 'center', value: 'user.firstName', sortable: false },
                { text: 'Employee surname', align: 'center', value: 'user.lastName', sortable: false },
                { text: 'Start date', align: 'center', value: 'startDate', sortable: false },
                { text: 'End date', align: 'center', value: 'endDate', sortable: false },
                { text: 'Duration/months', align: 'center', value: 'duration', sortable: false },
                { text: 'Available days off', align: 'center', value: 'availableDaysOffAmount', sortable: false },
                { text: 'Actions', value: 'actions', sortable: false }
            ],
            footerProps: {
                itemsPerPageText: 'Contracts per page'
            },
            showCreateOrEditModal: false,
            showConfirmDelete: false,
            contractToDeleteId: null,
            selectedItem: null,
            resourceName: 'contract'
        };
    },

    computed: {
        ...mapGetters({ contracts: 'contracts/contracts' })
    },

    methods: {
        ...mapActions({ deleteContract: 'contracts/deleteContract' }),

        openCreateOrEdit(selectedItem = null) {
            this.selectedItem = selectedItem;
            this.showCreateOrEditModal = true;
        },

        closeCreateOrEdit() {
            this.selectedItem = null;
            this.showCreateOrEditModal = false;
        },

        openConfirmDelete(contract) {
            this.contractToDeleteId = contract.id;
            this.showConfirmDelete = true;
        },

        async onDelete() {
            try {
                await this.deleteContract(this.contractToDeleteId);

                this.contractToDeleteId = null;
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
