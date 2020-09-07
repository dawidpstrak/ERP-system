<template>
    <div class="overlay">
        <v-form class="pa-10 white col-4" @submit.prevent="submit">
            <button class="exit-btn" @click="onClose">
                <v-icon>{{ 'mdi-location-exit' }}</v-icon>
            </button>

            <v-toolbar-title class="mb-6 text-h4" align="center">{{ formTitle() }}</v-toolbar-title>

            <v-text-field
                v-model="formData.firstName"
                :error-messages="firstNameErrors"
                label="First name"
                @input="$v.formData.firstName.$touch()"
                @blur="$v.formData.firstName.$touch()"
                @keyup="clearServerErrors('firstName')"
            />

            <v-text-field
                v-model="formData.lastName"
                :error-messages="lastNameErrors"
                label="Last name"
                @input="$v.formData.lastName.$touch()"
                @blur="$v.formData.lastName.$touch()"
                @keyup="clearServerErrors('lastName')"
            />

            <v-text-field
                v-model="formData.email"
                :error-messages="emailErrors"
                label="Email"
                @input="$v.formData.email.$touch()"
                @blur="$v.formData.email.$touch()"
                @keyup="clearServerErrors('email')"
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
                @keyup="clearServerErrors('password')"
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
                        @keyup="clearServerErrors('birthDate')"
                    />
                </template>
                <v-date-picker v-model="formData.birthDate" no-title />
            </v-menu>

            <v-btn class="mr-4" type="submit">submit</v-btn>

            <v-btn v-if="!isCreateModal()" class="ml-10" depressed color="error" @click="onDelete">Dismiss</v-btn>
        </v-form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import createOrEditValidator from '@/validators/users/createOrEditValidator.mixin';

import NotifyingService from '@/services/NotifyingService';

export default {
    props: {
        selectedItem: Object
    },

    mixins: [createOrEditValidator],

    data() {
        return {
            defaultFormData: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                birthDate: '',
                roles: [
                    {
                        name: 'user'
                    }
                ]
            },
            formData: {},
            showPassword: false
        };
    },

    created() {
        this.isCreateModal() ? this.setDefaultFormData() : this.setEditData();
    },

    methods: {
        ...mapActions(['saveEmployee', 'deleteEmployee']),
        async submit() {
            this.$v.$touch();

            if (this.$v.$invalid) {
                return;
            }

            this.onClose();

            try {
                await this.saveEmployee(this.formData);

                this.formData.id ? NotifyingService.updated('employee') : NotifyingService.created('employee');
            } catch (error) {
                if (!this.checkForServerFormErrors(error)) {
                    NotifyingService.handleError(error);
                }

                console.error(error);
            }
        },

        async onDelete() {
            try {
                await this.deleteEmployee(this.formData.id);

                NotifyingService.deleted('employee');
            } catch (error) {
                NotifyingService.handleError(error);

                console.error(error);
            }
        },

        formTitle() {
            return this.isCreateModal() ? 'New employee' : 'Edit employee';
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
