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
                @input="$v.formData.email.$touch"
                @blur="$v.formData.email.$touch"
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
                        @input="$v.formData.startDate.$touch"
                        @blur="$v.formData.startDate.$touch"
                    />
                </template>

                <v-date-picker v-model="formData.startDate" no-title />
            </v-menu>

            <v-select
                v-model="formData.duration"
                label="Duration in months"
                :items="durationOptions"
                :error-messages="durationErrors"
                @input="$v.formData.duration.$touch"
                @blur="$v.formData.duration.$touch"
            />

            <v-select
                v-model="formData.vacationsPerYear"
                label="Vacation days per year"
                :items="vacationsPerYearOptions"
                :error-messages="vacationsPerYearErrors"
                @input="$v.formData.vacationsPerYear.$touch"
                @blur="$v.formData.vacationsPerYear.$touch"
            />

            <v-container>
                <v-btn class="mr-4" type="submit">submit</v-btn>

                <v-btn v-if="isCreateModal()" @click="setDefaultFormData">reset</v-btn>

                <v-btn
                    v-if="!isCreateModal()"
                    class="ml-10"
                    depressed
                    color="error"
                    @click="deleteContract(formData.id)"
                    >Delete</v-btn
                >
            </v-container>
        </v-form>
    </div>
</template>

<script>
import moment from 'moment';

import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

export default {
    props: {
        selectedItem: Object
    },

    mixins: [validationMixin],

    validations: {
        formData: {
            email: {
                required,
                email
            },
            startDate: { required },
            duration: { required },
            vacationsPerYear: { required }
        }
    },

    data() {
        return {
            defaultFormData: {
                email: '',
                startDate: '',
                endDate: '',
                duration: null,
                vacationsPerYear: null,
                availableDaysOff: null
            },
            formData: {},
            durationOptions: [1, 3, 6, 12],
            vacationsPerYearOptions: [20, 26]
        };
    },

    computed: {
        emailErrors() {
            const errors = [];

            if (!this.$v.formData.email.$dirty) {
                return errors;
            }

            !this.$v.formData.email.email && errors.push('Must be valid e-mail');
            !this.$v.formData.email.required && errors.push('E-mail is required');

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

        durationErrors() {
            const errors = [];

            if (!this.$v.formData.duration.$dirty) {
                return errors;
            }

            !this.$v.formData.duration.required && errors.push('formData duration is required.');

            return errors;
        },

        vacationsPerYearErrors() {
            const errors = [];

            if (!this.$v.formData.vacationsPerYear.$dirty) {
                return errors;
            }

            !this.$v.formData.vacationsPerYear.required && errors.push('Vacation options field is required.');

            return errors;
        }
    },

    created() {
        this.setDefaultFormData();
        !this.isCreateModal() && this.setEditData();
    },

    methods: {
        ...mapActions(['saveContract', 'deleteContract']),

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
            this.formData.availableDaysOff = Math.round((this.formData.vacationsPerYear / 12) * this.formData.duration);
        },

        calculateAll() {
            this.calculateEndDate();
            this.calculateAvailableDaysOff();
        },

        async submit() {
            this.$v.$touch;

            if (!this.$v.$invalid) {
                this.calculateAll();

                await this.saveContract(this.formData);
            }
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
