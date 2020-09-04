<template>
    <div class="overlay">
        <v-form class="pa-10 white col-4" @submit.prevent="submit">
            <button class="exit-btn" @click="onClose">
                <v-icon>{{ 'mdi-location-exit' }}</v-icon>
            </button>

            <v-toolbar-title class="mb-6 text-h4" align="center">{{ formTitle() }}</v-toolbar-title>

            <v-text-field
                v-if="isAdmin && isCreateModal()"
                v-model="formData.email"
                :error-messages="emailErrors"
                label="Employee email"
                @input="$v.formData.email.$touch"
                @blur="$v.formData.email.$touch"
            />

            <v-select
                v-if="isAdmin"
                v-model="formData.status"
                label="Set request status"
                :items="requestStatuses"
                :error-messages="requestStatusesErrors"
                @input="$v.formData.status.$touch"
                @blur="$v.formData.status.$touch"
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
                        @input="$v.formData.startDate.$touch"
                        @blur="$v.formData.startDate.$touch"
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
                        @input="$v.formData.endDate.$touch"
                        @blur="$v.formData.endDate.$touch"
                    />
                </template>

                <v-date-picker v-model="formData.endDate" no-title />
            </v-menu>

            <v-container>
                <v-btn class="mr-4" type="submit">submit</v-btn>

                <v-btn
                    v-if="!isCreateModal()"
                    class="ml-10"
                    depressed
                    color="error"
                    @click="deleteVacationRequest(formData.id)"
                    >Delete</v-btn
                >
            </v-container>
        </v-form>
    </div>
</template>

<script>
import moment from 'moment';

import { validationMixin } from 'vuelidate';
import { required, email, requiredIf } from 'vuelidate/lib/validators';
import { mapActions, mapGetters } from 'vuex';

const mustBeAfterStartDate = (value, vm) => value > vm.startDate;

export default {
    props: {
        selectedItem: Object
    },

    mixins: [validationMixin],

    validations: {
        formData: {
            email: {
                required: requiredIf(function() {
                    return this.isAdmin && this.isCreateModal();
                }),
                email
            },
            status: {
                required: requiredIf(function() {
                    return this.isAdmin;
                })
            },
            startDate: { required },
            endDate: {
                required,
                mustBeAfterStartDate
            }
        }
    },

    data() {
        return {
            formData: {
                email: '',
                startDate: '',
                endDate: ''
            },
            requestStatuses: ['active', 'pending']
        };
    },

    computed: {
        ...mapGetters(['isAdmin']),
        emailErrors() {
            const errors = [];

            if (!this.$v.formData.email.$dirty) {
                return errors;
            }

            !this.$v.formData.email.email && errors.push('Must be valid e-mail');
            !this.$v.formData.email.required && errors.push('E-mail is required');

            return errors;
        },

        requestStatusesErrors() {
            const errors = [];

            if (!this.$v.formData.status.$dirty) {
                return errors;
            }

            !this.$v.formData.status.required && errors.push('Request status is required');

            return errors;
        },

        startDateErrors() {
            const errors = [];

            if (!this.$v.formData.startDate.$dirty) {
                return errors;
            }

            !this.$v.formData.startDate.required && errors.push('Start date is required.');

            return errors;
        },

        endDateErrors() {
            const errors = [];

            if (!this.$v.formData.endDate.$dirty) {
                return errors;
            }
            !this.$v.formData.endDate.required && errors.push('End date is required.');
            !this.$v.formData.endDate.mustBeAfterStartDate && errors.push('End date must be after start date');

            return errors;
        }
    },

    created() {
        !this.isCreateModal() && this.setEditData();
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
            this.$v.$touch;

            if (!this.$v.$invalid) {
                this.saveVacationRequest(this.formData);
            }
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
