<template>
    <v-dialog v-model="showCreateOrEditModal" width="350" persistent>
        <v-card>
            <v-form class="relative" data-cy="vacation-form" @submit.prevent="submit">
                <v-card-title class="d-flex justify-space-between px-6"
                    >{{ formTitle }}
                    <v-btn icon @click="onClose">
                        <v-icon>{{ 'mdi-location-exit' }}</v-icon>
                    </v-btn>
                </v-card-title>

                <div class="px-6">
                    <user-search-input
                        v-if="isAdmin"
                        v-model="formData.userId"
                        data-cy="vacation-user-search-input"
                        :userData="formData.user"
                        :errorMessages="userIdErrors"
                        @keyup="clearServerErrors('userId')"
                    />

                    <v-select
                        v-if="isAdmin"
                        v-model="formData.status"
                        label="Set request status"
                        :items="requestStatuses"
                        :error-messages="statusErrors"
                        @input="$v.formData.status.$touch"
                        @blur="$v.formData.status.$touch"
                        @keyup="clearServerErrors('status')"
                    />

                    <v-menu
                        :nudge-right="40"
                        :close-on-content-click="false"
                        min-width="none"
                        transition="scale-transition"
                    >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                class="mb-2"
                                label="Start date"
                                :error-messages="startDateErrors"
                                :value="formData.startDate"
                                readonly
                                data-cy="vacation-start-date-input"
                                v-on="on"
                                @input="$v.formData.startDate.$touch"
                                @blur="$v.formData.startDate.$touch"
                                @keyup="clearServerErrors('startDate')"
                            />
                        </template>

                        <v-date-picker v-model="formData.startDate" no-title />
                    </v-menu>

                    <v-menu
                        :nudge-right="40"
                        :close-on-content-click="false"
                        min-width="none"
                        transition="scale-transition"
                    >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                class="mb-2"
                                label="End date"
                                :error-messages="endDateErrors"
                                :value="formData.endDate"
                                readonly
                                data-cy="vacation-end-date-input"
                                v-on="on"
                                @input="$v.formData.endDate.$touch"
                                @blur="$v.formData.endDate.$touch"
                                @keyup="clearServerErrors('endDate')"
                            />
                        </template>

                        <v-date-picker v-model="formData.endDate" no-title />
                    </v-menu>

                    <v-card-actions class="d-flex justify-center">
                        <v-btn outlined color="primary" data-cy="vacation-submit-button" type="submit">submit</v-btn>
                    </v-card-actions>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import moment from 'moment';
import createOrEditValidation from '@/validators/vacationRequests/createOrEditValidator.mixin';
import NotificationService from '@/services/NotificationService';

import { mapActions, mapGetters } from 'vuex';

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

    mixins: [createOrEditValidation],

    data() {
        return {
            formData: {
                userId: null,
                startDate: '',
                endDate: '',
                status: 'pending'
            },
            requestStatuses: ['active', 'pending'],
            resourceName: 'vacation request'
        };
    },

    computed: {
        ...mapGetters(['isAdmin']),

        formTitle() {
            return this.isCreateModal ? 'New vacation' : 'Edit vacation';
        },

        isCreateModal() {
            return !this.selectedItem;
        }
    },

    created() {
        !this.isCreateModal && this.setEditData();
    },

    methods: {
        ...mapActions({
            saveVacationRequest: 'vacationRequests/saveVacationRequest',
            deleteVacationRequest: 'vacationRequests/deleteVacationRequest'
        }),

        async submit() {
            this.$v.$touch();

            if (this.$v.$invalid) {
                return;
            }

            try {
                await this.saveVacationRequest(this.formData);

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
            this.formData = {
                ...this.selectedItem
            };
        }
    }
};
</script>
