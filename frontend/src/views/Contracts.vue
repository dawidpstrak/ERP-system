<template>
    <v-container fluid>
        <v-container class="d-flex justify-center pa-3">
            <v-btn class="ma-2" tile outlined color="success" @click="openModal('createContract')">
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
            @click:row="openModal('editContract', $event)"
        />

        <Modal
            v-if="modal.show"
            :modalType="modal.type"
            :editData="modal.editData"
            @closeModal="closeModal"
        />
    </v-container>
</template>

<script>
import CreateOrEditContract from '../components/CreateOrEditContract';
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
        Modal: CreateOrEditContract
    },
    data() {
        return {
            headers: [
                { text: 'Name', align: 'center', value: 'user.name', sortable: false },
                { text: 'Surname', align: 'center', value: 'user.surname', sortable: false },
                { text: 'Start date', align: 'center', value: 'startDate', sortable: false },
                { text: 'End date', align: 'center', value: 'endDate', sortable: false },
                { text: 'Duration', align: 'center', value: 'duration', sortable: false },
                { text: 'Vacation days left', align: 'center', value: 'daysOff', sortable: false }
            ],
            footerProps: {
                itemsPerPageText: 'Contracts per page'
            },
            modal: {
                type: '',
                editData: {},
                show: false
            }
        };
    },
    computed: {
        ...mapGetters({ contracts: 'getContracts' })
    },
    methods: {
        ...mapActions(['fetchContracts']),
        openModal(modalType, editData) {
            this.modal.type = modalType;
            this.modal.editData = editData;
            this.modal.show = true;
        },
        closeModal() {
            this.modal.type = '';
            this.editData = {};
            this.modal.show = false;
        }
    },
    async created() {
        await this.fetchContracts();
    }
};
</script>
