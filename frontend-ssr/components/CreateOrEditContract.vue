<template>
    <v-dialog v-model="isModalShown" width="350" persistent>
        <v-card>
            <v-form data-cy="contract-form" @submit.prevent="submit">
                <v-card-title class="d-flex justify-space-between px-6">
                    {{ formTitle() }}
                    <v-btn icon @click="onClose">
                        <v-icon>{{ 'mdi-location-exit' }}</v-icon>
                    </v-btn>
                </v-card-title>

                <div class="px-6">
                    <user-search-input
                        v-model="formData.userId"
                        :userData="formData.user"
                        :errorMessages="userIdErrors"
                        data-cy="contract-user-search-input"
                        @keyup="clearServerErrors('userId')"
                    />

                    <v-menu :nudge-right="40" min-width="none" transition="scale-transition">
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                class="mb-2"
                                label="Start date"
                                :error-messages="startDateErrors"
                                :value="formData.startDate"
                                readonly
                                data-cy="contract-start-date-input"
                                v-on="on"
                                @input="$v.formData.startDate.$touch"
                                @blur="$v.formData.startDate.$touch"
                                @keyup="clearServerErrors('startDate')"
                            />
                        </template>

                        <v-date-picker v-model="formData.startDate" no-title />
                    </v-menu>

                    <v-select
                        v-model="formData.duration"
                        label="Duration in months"
                        :items="durationOptions"
                        :error-messages="durationErrors"
                        data-cy="contract-duration-input"
                        @input="$v.formData.duration.$touch"
                        @blur="$v.formData.duration.$touch"
                        @keyup="clearServerErrors('duration')"
                    />

                    <v-select
                        v-model="formData.vacationsPerYear"
                        label="Vacation days per year"
                        :items="vacationsPerYearOptions"
                        :error-messages="vacationsPerYearErrors"
                        data-cy="contract-vacation-days-options-select"
                        @input="$v.formData.vacationsPerYear.$touch"
                        @blur="$v.formData.vacationsPerYear.$touch"
                        @keyup="clearServerErrors('vacationsPerYear')"
                    />

                    <v-card-actions class="d-flex justify-center">
                        <v-btn outlined color="primary" data-cy="contract-submit-button" type="submit">submit</v-btn>
                    </v-card-actions>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import createOrEditValidator from '@/validators/contracts/createOrEditValidator.mixin';
import NotificationService from '@/services/NotificationService';

import { mapActions } from 'vuex';

export default {
    props: {
        selectedItem: {
            type: Object,
            required: false,
            default: null
        },
        showCreateOrEditModal: {
            type: Boolean,
            required: true
        }
    },

    mixins: [createOrEditValidator],

    data() {
        return {
            defaultFormData: {
                userId: null,
                startDate: '',
                duration: null,
                vacationsPerYear: null
            },
            formData: {},
            durationOptions: [1, 3, 6, 12],
            vacationsPerYearOptions: [20, 26],
            isModalShown: this.showCreateOrEditModal,
            resourceName: 'contract'
        };
    },

    created() {
        this.isCreateModal() ? this.setDefaultFormData() : this.setEditData();
    },

    methods: {
        ...mapActions({
            saveContract: 'contracts/saveContract',
            deleteContract: 'contracts/deleteContract'
        }),

        async submit() {
            this.$v.$touch();

            if (this.$v.$invalid) {
                return;
            }

            try {
                await this.saveContract(this.formData);

                this.onClose();

                this.formData.id
                    ? NotificationService.updated(this.resourceName)
                    : NotificationService.created(this.resourceName);
            } catch (error) {
                if (!this.checkForServerFormErrors(error)) {
                    NotificationService.handleError(error);
                }

                console.error(error);
            }
        },

        formTitle() {
            return this.isCreateModal() ? 'New contract' : 'Edit contract';
        },

        onClose() {
            this.$emit('closeModal');
        },

        setDefaultFormData() {
            this.formData = { ...this.defaultFormData };
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
