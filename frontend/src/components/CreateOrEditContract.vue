<template>
    <v-dialog v-model="isModalShown" width="350" persistent>
        <v-card>
            <v-form @submit.prevent="submit">
                <v-card-title class="d-flex justify-space-between px-6"
                    >{{ formTitle() }}
                    <v-btn icon @click="onClose">
                        <v-icon>{{ 'mdi-location-exit' }}</v-icon>
                    </v-btn>
                </v-card-title>

                <div class="px-6">
                    <v-text-field
                        v-model="formData.email"
                        :error-messages="emailErrors"
                        label="Employee email"
                        @input="$v.formData.email.$touch()"
                        @blur="$v.formData.email.$touch()"
                        @keyup="clearServerErrors('email')"
                    />

                    <v-menu :nudge-right="40" min-width="none" transition="scale-transition">
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

                    <v-select
                        v-model="formData.duration"
                        label="Duration in months"
                        :items="durationOptions"
                        :error-messages="durationErrors"
                        @input="$v.formData.duration.$touch()"
                        @blur="$v.formData.duration.$touch()"
                        @keyup="clearServerErrors('duration')"
                    />

                    <v-select
                        v-model="formData.vacationsPerYear"
                        label="Vacation days per year"
                        :items="vacationsPerYearOptions"
                        :error-messages="vacationsPerYearErrors"
                        @input="$v.formData.vacationsPerYear.$touch()"
                        @blur="$v.formData.vacationsPerYear.$touch()"
                        @keyup="clearServerErrors('vacationsPerYear')"
                    />

                    <v-card-actions class="d-flex justify-center">
                        <v-btn outlined color="primary" type="submit">submit</v-btn>
                    </v-card-actions>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import createOrEditValidator from '@/validators/contracts/createOrEditValidator.mixin';
import NotifyingService from '@/services/NotifyingService';
import moment from 'moment';

import { mapActions } from 'vuex';

export default {
    props: {
        selectedItem: Object,
        showCreateOrEditModal: Boolean
    },

    mixins: [createOrEditValidator],

    data() {
        return {
            defaultFormData: {
                email: '',
                startDate: '',
                endDate: '',
                duration: null,
                vacationsPerYear: null,
                availableDaysOffAmount: null
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
        ...mapActions(['saveContract', 'deleteContract']),
        async submit() {
            this.$v.$touch();

            if (this.$v.$invalid) {
                return;
            }

            this.calculateAll();

            try {
                await this.saveContract(this.formData);

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
            return this.isCreateModal() ? 'New contract' : 'Edit contract';
        },

        onClose() {
            this.$emit('closeModal');
        },

        calculateEndDate() {
            const startDate = moment(this.formData.startDate);

            const endDate = startDate.add(this.formData.duration, 'M').format('YYYY-MM-DD');

            this.formData.endDate = endDate;
        },

        calculateAvailableDaysOff() {
            this.formData.availableDaysOffAmount = Math.round(
                (this.formData.vacationsPerYear / 12) * this.formData.duration
            );
        },

        calculateAll() {
            // TODO extra check on backend in future
            this.calculateEndDate();
            this.calculateAvailableDaysOff();
        },

        setDefaultFormData() {
            this.formData = { ...this.defaultFormData };
        },

        setEditData() {
            this.formData = { email: this.selectedItem.user.email, ...this.selectedItem };
        },

        isCreateModal() {
            return !this.selectedItem;
        }
    }
};
</script>

<style lang="scss" scoped>
form {
    position: relative;
}
.exit-btn {
    position: absolute;
    right: 20px;
    top: 20px;
}
</style>
