<template>
    <div class="overlay">
        <v-form class="pa-10 white col-4" @submit.prevent="submit">
            <button class="exit-btn" @click="onClose">
                <v-icon>{{ 'mdi-location-exit' }}</v-icon>
            </button>

            <v-toolbar-title class="mb-6 text-h4" align="center">{{ formTitle() }}</v-toolbar-title>

            <v-menu :nudge-right="40" :close-on-content-click="false" min-width="none" transition="scale-transition">
                <template v-slot:activator="{ on }">
                    <v-text-field
                        class="mb-2"
                        label="Start date"
                        :error-messages="startDateErrors"
                        :value="vacationRequest.startDate"
                        readonly
                        v-on="on"
                        @input="$v.vacationRequest.startDate.$touch()"
                        @blur="$v.vacationRequest.startDate.$touch()"
                    />
                </template>

                <v-date-picker v-model="vacationRequest.startDate" no-title />
            </v-menu>

            <v-menu :nudge-right="40" :close-on-content-click="false" min-width="none" transition="scale-transition">
                <template v-slot:activator="{ on }">
                    <v-text-field
                        class="mb-2"
                        label="End date"
                        :error-messages="endDateErrors"
                        :value="vacationRequest.endDate"
                        readonly
                        v-on="on"
                        @input="$v.vacationRequest.endDate.$touch()"
                        @blur="$v.vacationRequest.endDate.$touch()"
                    />
                </template>

                <v-date-picker v-model="vacationRequest.endDate" no-title />
            </v-menu>

            <v-container>
                <v-btn class="mr-4" type="submit">submit</v-btn>

                <v-btn
                    v-if="!isCreateModal()"
                    class="ml-10"
                    depressed
                    color="error"
                    @click="deleteVacationRequest(vacationRequest.id)"
                    >Delete</v-btn
                >
            </v-container>
        </v-form>
    </div>
</template>

<script>
import moment from 'moment';

import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

const mustBeAfterStartDate = (value, vm) => value > vm.startDate;

export default {
    props: {
        selectedItem: Object
    },

    mixins: [validationMixin],

    validations: {
        vacationRequest: {
            startDate: { required },
            endDate: {
                required,
                mustBeAfterStartDate
            }
        }
    },

    data() {
        return {
            vacationRequest: {
                startDate: '',
                endDate: ''
            }
        };
    },

    computed: {
        startDateErrors() {
            const errors = [];

            if (!this.$v.vacationRequest.startDate.$dirty) {
                return errors;
            }

            !this.$v.vacationRequest.startDate.required && errors.push('Start date is required.');

            return errors;
        },

        endDateErrors() {
            const errors = [];

            if (!this.$v.vacationRequest.endDate.$dirty) {
                return errors;
            }
            !this.$v.vacationRequest.endDate.required && errors.push('End date is required.');
            !this.$v.vacationRequest.endDate.mustBeAfterStartDate && errors.push('End date must be after start date');

            return errors;
        }
    },
    methods: {
        ...mapActions(['saveVacationRequest', 'deleteVacationRequest']),

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

        submit() {
            this.$v.$touch();

            if (!this.$v.$invalid) {
                this.saveVacationRequest(this.vacationRequest);
            }
        },

        setEditData() {
            this.vacationRequest = { ...this.selectedItem };
        },

        isCreateModal() {
            return !this.selectedItem;
        }
    },

    created() {
        !this.isCreateModal() && this.setEditData();
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
