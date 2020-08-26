<template>
    <div class="overlay">
        <v-form class="pa-10 white col-4" @submit.prevent="submit">
            <button class="exit-btn" @click="onClose">
                <v-icon>{{ 'mdi-location-exit' }}</v-icon>
            </button>

            <v-toolbar-title class="mb-6 text-h4" align="center">{{ formTitle() }}</v-toolbar-title>

            <v-text-field
                v-model="formData.name"
                :error-messages="nameErrors"
                :counter="20"
                label="Name"
                @input="$v.formData.name.$touch()"
                @blur="$v.formData.name.$touch()"
            />

            <v-text-field
                v-model="formData.surname"
                :error-messages="surnameErrors"
                :counter="20"
                label="Surname"
                @input="$v.formData.surname.$touch()"
                @blur="$v.formData.surname.$touch()"
            />

            <v-text-field
                v-model="formData.email"
                :error-messages="emailErrors"
                label="Email"
                @input="$v.formData.email.$touch()"
                @blur="$v.formData.email.$touch()"
            />

            <v-text-field
                v-if="isCreateModal()"
                v-model="formData.password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :error-messages="passwordErrors"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                @click:append="showPassword = !showPassword"
                @input="$v.formData.password.$touch()"
                @blur="$v.formData.password.$touch()"
            />

            <v-text-field
                v-if="isCreateModal()"
                v-model="formData.repeatPassword"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :error-messages="repeatPasswordErrors"
                :type="showPassword ? 'text' : 'password'"
                label="Repeat password"
                @click:append="showPassword = !showPassword"
                @input="$v.formData.repeatPassword.$touch()"
                @blur="$v.formData.repeatPassword.$touch()"
            />

            <v-menu :nudge-right="40" min-width="none" transition="scale-transition">
                <template v-slot:activator="{ on }">
                    <v-text-field
                        class="mb-2"
                        label="Birth Date"
                        :error-messages="birthDateErrors"
                        :value="formData.birthDate"
                        readonly
                        v-on="on"
                        @input="$v.formData.birthDate.$touch()"
                        @blur="$v.formData.birthDate.$touch()"
                    />
                </template>
                <v-date-picker v-model="formData.birthDate" no-title />
            </v-menu>

            <v-btn class="mr-4" type="submit">submit</v-btn>

            <v-btn v-if="isCreateModal()" @click="resetForm">reset</v-btn>

            <v-btn
                v-if="!isCreateModal()"
                class="ml-10"
                depressed
                color="error"
                @click="deleteEmployee(formData)"
            >Dismiss</v-btn>
        </v-form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, sameAs, email } from 'vuelidate/lib/validators';

const defaultFormData = {
    name: '',
    surname: '',
    email: '',
    password: '',
    repeatPassword: '',
    roles: [
        {
            name: 'user'
        }
    ],
    birthDate: ''
};

export default {
    props: {
        selectedItem: Object
    },

    mixins: [validationMixin],

    validations() {
        const validations = {
            formData: {
                ...this.validations
            }
        };

        if (this.isCreateModal()) {
            validations.formData.password = {
                required,
                minLength: minLength(6),
                maxLength: maxLength(32)
            };
            validations.formData.repeatPassword = {
                sameAsPassword: sameAs(function () {
                    return this.formData.password;
                })
            };
        }

        return validations;
    },

    data() {
        return {
            formData: { ...defaultFormData },

            showPassword: false,
            validations: {
                name: { required, minLength: minLength(3), maxLength: maxLength(20) },
                surname: { required, minLength: minLength(3), maxLength: maxLength(20) },
                email: { required, email },
                birthDate: { required }
            }
        };
    },

    computed: {
        nameErrors() {
            const errors = [];

            if (!this.$v.formData.name.$dirty) {
                return errors;
            }

            !this.$v.formData.name.minLength && errors.push('Name must be at least 3 characters long');
            !this.$v.formData.name.maxLength && errors.push('Name must be at most 20 characters long');
            !this.$v.formData.name.required && errors.push('Name is required.');

            return errors;
        },
        surnameErrors() {
            const errors = [];

            if (!this.$v.formData.surname.$dirty) {
                return errors;
            }

            !this.$v.formData.surname.minLength && errors.push('Surname must be at least 3 characters long');
            !this.$v.formData.surname.maxLength && errors.push('Surame must be at most 20 characters long');
            !this.$v.formData.surname.required && errors.push('Surname is required.');

            return errors;
        },
        emailErrors() {
            const errors = [];

            if (!this.$v.formData.email.$dirty) {
                return errors;
            }

            !this.$v.formData.email.email && errors.push('Must be valid e-mail');
            !this.$v.formData.email.required && errors.push('E-mail is required');

            return errors;
        },
        passwordErrors() {
            const errors = [];

            if (!this.$v.formData.password.$dirty) {
                return errors;
            }

            !this.$v.formData.password.minLength && errors.push('Password must contains min 6 characters');
            !this.$v.formData.password.maxLength && errors.push('Password must contains max 32 characters');
            !this.$v.formData.password.required && errors.push('Password are required');

            return errors;
        },
        repeatPasswordErrors() {
            const errors = [];

            if (!this.$v.formData.repeatPassword.$dirty) {
                return errors;
            }

            !this.$v.formData.repeatPassword.sameAsPassword && errors.push('Passwords are not equal');

            return errors;
        },
        birthDateErrors() {
            const errors = [];

            if (!this.$v.formData.birthDate.$dirty) {
                return errors;
            }

            !this.$v.formData.birthDate.required && errors.push('Birth date is required.');

            return errors;
        }
    },

    methods: {
        ...mapActions(['saveEmployee', 'deleteEmployee']),
        submit() {
            this.$v.$touch();

            if (!this.$v.$invalid) {
                this.onClose();
                this.saveEmployee(this.formData);
            }
        },

        formTitle() {
            return this.isCreateModal() ? 'New employee' : 'Edit employee';
        },

        onClose() {
            this.$emit('closeModal');
        },

        resetForm() {
            this.formData = { ...defaultFormData };
        },

        setEditData() {
            this.formData = { ...this.selectedItem };
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

<style scoped>
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
