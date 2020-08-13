<template>
    <div class="overlay">
        <v-form class="pa-10 white col-4" @submit.prevent="submit">
            <button class="exit-btn" @click="onClose">
                <v-icon>{{ 'mdi-alpha-x-circle-outline' }}</v-icon>
            </button>

            <v-toolbar-title class="mb-6 text-h4" align="center">{{ formTitle() }}</v-toolbar-title>

            <v-text-field
                v-model="userData.name"
                :error-messages="nameErrors"
                :counter="20"
                label="Name"
                @input="$v.userData.name.$touch()"
                @blur="$v.userData.name.$touch()"
            />

            <v-text-field
                v-model="userData.surname"
                :error-messages="surnameErrors"
                :counter="20"
                label="Surname"
                @input="$v.userData.surname.$touch()"
                @blur="$v.userData.surname.$touch()"
            />

            <v-text-field
                v-model="userData.email"
                :error-messages="emailErrors"
                label="Email"
                @input="$v.userData.email.$touch()"
                @blur="$v.userData.email.$touch()"
            />

            <v-text-field
                v-if="isCreateModal()"
                v-model="userData.password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :error-messages="passwordErrors"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                @click:append="showPassword = !showPassword"
                @input="$v.userData.password.$touch()"
                @blur="$v.userData.password.$touch()"
            />

            <v-text-field
                v-if="isCreateModal()"
                v-model="repeatPassword"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :error-messages="repeatPasswordErrors"
                :type="showPassword ? 'text' : 'password'"
                label="Repeat password"
                @click:append="showPassword = !showPassword"
                @input="$v.repeatPassword.$touch()"
                @blur="$v.repeatPassword.$touch()"
            />

            <v-menu :nudge-right="40" min-width="none" transition="scale-transition">
                <template v-slot:activator="{ on }">
                    <v-text-field
                        class="mb-2"
                        label="Birth Date"
                        :error-messages="birthDateErrors"
                        :value="userData.birthDate"
                        readonly
                        v-on="on"
                    />
                </template>
                <v-date-picker v-model="userData.birthDate" no-title />
            </v-menu>

            <v-btn class="mr-4" type="submit">submit</v-btn>

            <v-btn v-if="isCreateModal()" @click="reset">reset</v-btn>

            <v-btn
                v-if="!isCreateModal()"
                class="ml-10"
                depressed
                color="error"
                @click="deleteEmployee(userData.id)"
            >Dismiss</v-btn>
        </v-form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, sameAs, email } from 'vuelidate/lib/validators';

export default {
    props: {
        modalType: String,
        editData: Object
    },
    mixins: [validationMixin],

    validations() {
        const validations = {
            userData: {
                ...this.validations
            }
        };

        if (this.isCreateModal()) {
            validations.userData.password = {
                required,
                minLength: minLength(6),
                maxLength: maxLength(32)
            };
            validations.repeatPassword = {
                sameAsPassword: sameAs(function () {
                    return this.userData.password;
                })
            };
        }

        return validations;
    },

    data() {
        return {
            userData: {
                name: '',
                surname: '',
                email: '',
                password: '',
                role: 'user',
                birthDate: ''
            },
            repeatPassword: '',
            showPassword: false,
            updatableFields: ['name', 'surname', 'email', 'birthDate'],
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

            if (!this.$v.userData.name.$dirty) {
                return errors;
            }

            !this.$v.userData.name.minLength && errors.push('Name must be at least 3 characters long');
            !this.$v.userData.name.maxLength && errors.push('Name must be at most 20 characters long');
            !this.$v.userData.name.required && errors.push('Name is required.');

            return errors;
        },
        surnameErrors() {
            const errors = [];

            if (!this.$v.userData.surname.$dirty) {
                return errors;
            }

            !this.$v.userData.surname.minLength && errors.push('Surname must be at least 3 characters long');
            !this.$v.userData.surname.maxLength && errors.push('Surame must be at most 20 characters long');
            !this.$v.userData.surname.required && errors.push('Surname is required.');

            return errors;
        },
        emailErrors() {
            const errors = [];

            if (!this.$v.userData.email.$dirty) {
                return errors;
            }

            !this.$v.userData.email.email && errors.push('Must be valid e-mail');
            !this.$v.userData.email.required && errors.push('E-mail is required');

            return errors;
        },
        passwordErrors() {
            const errors = [];

            if (!this.$v.userData.password.$dirty) {
                return errors;
            }

            !this.$v.userData.password.minLength && errors.push('Password must contains min 6 characters');
            !this.$v.userData.password.maxLength && errors.push('Password must contains max 32 characters');
            !this.$v.userData.password.required && errors.push('Password are required');

            return errors;
        },
        repeatPasswordErrors() {
            const errors = [];

            if (!this.$v.repeatPassword.$dirty) {
                return errors;
            }

            !this.$v.repeatPassword.sameAsPassword && errors.push('Passwords are not equal');

            return errors;
        },
        birthDateErrors() {
            const errors = [];

            if (!this.$v.userData.birthDate.$dirty) {
                return errors;
            }

            !this.$v.userData.birthDate.required && errors.push('Birth date is required.');

            return errors;
        }
    },

    methods: {
        ...mapActions(['saveEmployee', 'deleteEmployee']),
        async submit() {
            this.$v.$touch();

            if (!this.$v.$invalid) {
                this.onClose();
                await this.saveEmployee(this.userData);
            }
        },
        fillForm() {
            this.userData = { ...this.editData };
        },
        reset() {
            this.$v.$reset();
            this.userData = {
                name: '',
                surname: '',
                email: '',
                password: '',
                role: 'user',
                birthDate: ''
            };
            this.repeatPassword = '';
        },
        isCreateModal() {
            return this.modalType === 'createEmployee';
        },
        formTitle() {
            return this.isCreateModal() ? 'New employee' : 'Edit employee';
        },
        onClose() {
            this.$emit('closeModal');
        }
    },
    beforeMount() {
        this.isCreateModal() ? this.reset() : this.fillForm();
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
