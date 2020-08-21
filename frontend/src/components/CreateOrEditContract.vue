<template>
    <div class="overlay">
        <v-form class="pa-10 white col-4" @submit.prevent="submit">
            <button class="exit-btn" @click="onClose">
                <v-icon>{{ 'mdi-location-exit' }}</v-icon>
            </button>

            <v-toolbar-title class="mb-6 text-h4" align="center">{{ formTitle() }}</v-toolbar-title>

            <v-text-field
                v-if="isCreateModal()"
                v-model="contract.email"
                :error-messages="emailErrors"
                label="Employee email"
                @input="$v.contract.email.$touch()"
                @blur="$v.contract.email.$touch()"
            />

            <v-menu :nudge-right="40" min-width="none" transition="scale-transition">
                <template v-slot:activator="{ on }">
                    <v-text-field
                        class="mb-2"
                        label="Start date"
                        :error-messages="startDateErrors"
                        :value="contract.startDate"
                        readonly
                        v-on="on"
                        @input="$v.contract.startDate.$touch()"
                        @blur="$v.contract.startDate.$touch()"
                    />
                </template>

                <v-date-picker v-model="contract.startDate" no-title />
            </v-menu>

            <v-select
                v-model="contract.duration"
                label="Duration in months"
                :items="durationOptions"
                :error-messages="durationErrors"
                @input="$v.contract.duration.$touch()"
                @blur="$v.contract.duration.$touch()"
            />

            <v-select
                v-model="contract.vacationsPerYear"
                label="Vacation days per year"
                :items="vacationsPerYearOptions"
                :error-messages="vacationsPerYearErrors"
                @input="$v.contract.vacationsPerYear.$touch()"
                @blur="$v.contract.vacationsPerYear.$touch()"
            />

            <v-container>
                <v-btn class="mr-4" type="submit">submit</v-btn>

                <v-btn v-if="isCreateModal()" @click="reset">reset</v-btn>

                <v-btn
                    v-if="!isCreateModal()"
                    class="ml-10"
                    depressed
                    color="error"
                    @click="deleteContract(contract.id)"
                >Delete</v-btn>
            </v-container>
        </v-form>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, requiredIf, email } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

export default {
    props: {
        modalType: String,
        editData: Object
    },

    mixins: [validationMixin],

    validations: {
        contract: {
            email: {
                required: requiredIf(function () {
                    return this.isCreateModal();
                }),
                email
            },
            startDate: { required },
            duration: { required },
            vacationsPerYear: { required }
        }
    },
    data() {
        return {
            contract: {
                email: '',
                startDate: '',
                endDate: '',
                duration: null,
                vacationsPerYear: null,
                status: 'active',
                daysOff: null
            },
            durationOptions: [1, 3, 6, 12],
            vacationsPerYearOptions: [20, 26]
        };
    },
    computed: {
        emailErrors() {
            const errors = [];

            if (!this.$v.contract.email.$dirty) {
                return errors;
            }

            !this.$v.contract.email.email && errors.push('Must be valid e-mail');
            !this.$v.contract.email.required && errors.push('E-mail is required');

            return errors;
        },
        startDateErrors() {
            const errors = [];

            if (!this.$v.contract.startDate.$dirty) {
                return errors;
            }

            !this.$v.contract.startDate.required && errors.push('Start date is required.');

            return errors;
        },
        durationErrors() {
            const errors = [];

            if (!this.$v.contract.duration.$dirty) {
                return errors;
            }

            !this.$v.contract.duration.required && errors.push('Contract duration is required.');

            return errors;
        },
        vacationsPerYearErrors() {
            const errors = [];

            if (!this.$v.contract.vacationsPerYear.$dirty) {
                return errors;
            }

            !this.$v.contract.vacationsPerYear.required && errors.push('Vacation options field is required.');

            return errors;
        }
    },
    methods: {
        ...mapActions(['saveContract', 'deleteContract']),
        formTitle() {
            return this.isCreateModal() ? 'New contract' : 'Edit contract';
        },
        onClose() {
            this.$emit('closeModal');
        },
        isCreateModal() {
            return this.modalType === 'createContract';
        },
        calculateEndDate() {
            const startDate = new Date(this.contract.startDate);
            const contract = this.contract;

            contract.endDate = new Date(startDate.setMonth(startDate.getMonth() + contract.duration))
                .toISOString()
                .split('T')[0];
        },
        calculateDaysOff() {
            const contract = this.contract;

            contract.daysOff = Math.round((contract.vacationsPerYear / 12) * contract.duration);
        },
        async submit() {
            this.$v.$touch();

            if (!this.$v.$invalid) {
                this.calculateEndDate();
                this.calculateDaysOff();

                await this.saveContract(this.contract);
            }
        },
        reset() {
            this.contract = {
                email: '',
                startDate: '',
                endDate: '',
                duration: null,
                vacationsPerYear: null,
                status: 'active',
                daysOff: null
            };
        },
        fillForm() {
            this.contract = { email: this.editData.user.email, ...this.editData };
        }
    },
    beforeMount() {
        this.isCreateModal() ? this.reset() : this.fillForm();
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
