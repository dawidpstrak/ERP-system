<template>
    <v-container fluid>
        <v-container class="d-flex justify-center pa-3">
            <v-btn class="ma-2" tile outlined color="success" @click="openModal('createEmployee')">
                <v-icon left>mdi-plus</v-icon>employee
            </v-btn>
        </v-container>

        <v-data-table
            :headers="headers"
            :items="employees"
            :items-per-page="5"
            :mobile-breakpoint="990"
            :footer-props="footerProps"
            class="elevation-1"
            @click:row="openModal('editEmployee', $event)"
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
import { mapActions, mapGetters } from 'vuex';
import CreateOrEditEmployee from './CreateOrEditEmployee';

export default {
    components: { Modal: CreateOrEditEmployee },
    data() {
        return {
            headers: [
                { text: 'Name', align: 'center', value: 'name', sortable: false },
                { text: 'Surname', align: 'center', value: 'surname', sortable: false },
                { text: 'Email', align: 'center', value: 'email', sortable: false },
                { text: 'Available vacations', align: 'center', value: 'id', sortable: false },
                { text: 'Birth date', align: 'center', value: 'birthDate', sortable: false }
            ],
            footerProps: {
                itemsPerPageText: 'Employees per page'
            },
            modal: {
                show: false,
                type: '',
                editData: {}
            }
        };
    },
    methods: {
        ...mapActions(['fetchEmployees']),
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
    computed: {
        ...mapGetters({ employees: 'getEmployees' })
    },
    async created() {
        await this.fetchEmployees();
    }
};
</script>
