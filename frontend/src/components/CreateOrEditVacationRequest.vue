<template>
    <v-dialog v-model="isModalShown" width="400" persistent>
        <v-form class="pa-10 white" @submit.prevent="submit">
            <button class="exit-btn" @click="onClose">
                <v-icon>{{ 'mdi-location-exit' }}</v-icon>
            </button>

            <v-toolbar-title class="mb-6 text-h4" align="center">{{ formTitle() }}</v-toolbar-title>

            <v-text-field
                v-if="isAdmin && isCreateModal()"
                v-model="formData.email"
                :error-messages="emailErrors"
                label="Employee email"
                @input="$v.formData.email.$touch()"
                @blur="$v.formData.email.$touch()"
                @keyup="clearServerErrors('email')"
            />

            <v-select
                v-if="isAdmin"
                v-model="formData.status"
                label="Set request status"
                :items="requestStatuses"
                :error-messages="statusErrors"
                @input="$v.formData.status.$touch()"
                @blur="$v.formData.status.$touch()"
                @keyup="clearServerErrors('status')"
            />

            <v-menu :nudge-right="40" :close-on-content-click="false" min-width="none" transition="scale-transition">
                <template v-slot:activator="{ on }">
                    <v-text-field
                        class="mb-2"
                        label="Start date"
                        :error-messages="startDateErrors"
                        :value="formData.startDate"
                        readonly
                        v-on="on"
                        @input="$v.formData.startDate.$touch()"
                        @blur="$v.formData.startDate.$touch()"
                        @keyup="clearServerErrors('startDate')"
                    />
                </template>

                <v-date-picker v-model="formData.startDate" no-title />
            </v-menu>

            <v-menu :nudge-right="40" :close-on-content-click="false" min-width="none" transition="scale-transition">
                <template v-slot:activator="{ on }">
                    <v-text-field
                        class="mb-2"
                        label="End date"
                        :error-messages="endDateErrors"
                        :value="formData.endDate"
                        readonly
                        v-on="on"
                        @input="$v.formData.endDate.$touch()"
                        @blur="$v.formData.endDate.$touch()"
                        @keyup="clearServerErrors('endDate')"
                    />
                </template>

                <v-date-picker v-model="formData.endDate" no-title />
            </v-menu>

            <v-card-actions class="d-flex justify-center">
                <v-btn text color="primary" type="submit">submit</v-btn>
            </v-card-actions>
        </v-form>
    </v-dialog>
</template>

<script>
import moment from 'moment';
import createOrEditValidation from '@/validators/vacationRequests/createOrEditValidator.mixin';
import NotifyingService from '@/services/NotifyingService';

import { mapActions, mapGetters } from 'vuex';

export default {
    props: {
        selectedItem: Object,
        showCreateOrEditModal: Boolean
    },

    mixins: [createOrEditValidation],

    data() {
        return {
            formData: {
                email: '',
                startDate: '',
                endDate: '',
                status: 'pending'
            },
            requestStatuses: ['active', 'pending'],
            isModalShown: this.showCreateOrEditModal,
            resourceName: 'vacation request'
        };
    },

    computed: {
        ...mapGetters(['isAdmin'])
    },

    created() {
        !this.isCreateModal() && this.setEditData();
    },

    methods: {
        ...mapActions(['saveVacationRequest', 'deleteVacationRequest']),

        async submit() {
            this.$v.$touch();

            if (this.$v.$invalid) {
                return;
            }

            try {
                await this.saveVacationRequest(this.formData);

                this.onClose();

                this.formData.id
                    ? NotifyingService.updated(this.resourceName)
                    : NotifyingService.created(this.resourceName);
            } catch (error) {
                if (!this.checkForServerFormErrors(error)) {
                    NotifyingService.handleError(error);
                }

                console.error(error);
            }
        },

        formTitle() {
            return this.isCreateModal() ? 'New vacation' : 'Edit vacation';
        },

        onClose() {
            this.$emit('closeModal');
        },

        calculateVacationDuration(endDate, startDate) {
            const vacationStart = moment(startDate);
            const vacationEnd = moment(endDate);

            const vacationDuration = moment.duration(vacationEnd.diff(vacationStart)).days();

            return vacationDuration;
        },

        setEditData() {
            this.formData = { ...this.selectedItem };
        },

        isCreateModal() {
            return !this.selectedItem;
        }
    }
};
</script>

<style lang="scss" scoped>
.exit-btn {
    position: absolute;
    right: 20px;
    top: 20px;
}
form {
    position: relative;
}
</style>
