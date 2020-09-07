<template>
    <div class="overlay">
        <v-form class="pa-10 white col-4" @submit.prevent="submit">
            <button class="exit-btn" @click="onClose">
                <v-icon>{{ 'mdi-location-exit' }}</v-icon>
            </button>

            <v-toolbar-title class="mb-6 text-h4" align="center">{{ formTitle() }}</v-toolbar-title>

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

            <v-container>
                <v-btn class="mr-4" type="submit">submit</v-btn>

                <v-btn v-if="isCreateModal()" @click="setDefaultFormData">reset</v-btn>

                <v-btn v-if="!isCreateModal()" class="ml-10" depressed color="error" @click="onDelete">Delete</v-btn>
            </v-container>
        </v-form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import createOrEditValidator from '@/validators/contracts/createOrEditValidator.mixin';

import moment from 'moment';

import NotifyingService from '@/services/NotifyingService';

export default {
    props: {
        selectedItem: Object
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
            vacationsPerYearOptions: [20, 26]
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

                this.formData.id ? NotifyingService.updated('contract') : NotifyingService.created('contract');
            } catch (error) {
                if (!this.checkForServerFormErrors(error)) {
                    NotifyingService.handleError(error);
                }

                console.error(error);
            }
        },

        async onDelete() {
            try {
                await this.deleteContract(this.formData.id);

                NotifyingService.deleted('contract');
            } catch (error) {
                NotifyingService.handleError(error);

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
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(102, 106, 107, 0.63);
    display: flex;
    justify-content: center;
    align-items: center;
}
form {
    position: relative;
}
.exit-btn {
    position: absolute;
    right: 20px;
    top: 20px;
}
</style>
