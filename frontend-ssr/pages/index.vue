<template>
    <v-container fill-height fluid flex-column justify-center>
        <v-card width="400">
            <v-card-title>
                <h1 class="display-1">Login</h1>
            </v-card-title>
            <v-card-text>
                <v-form class="pb-0">
                    <v-text-field
                        v-model="credentials.email"
                        label="Email"
                        prepend-icon="mdi-account-circle"
                        error-count="2"
                        required
                        :error-messages="emailErrors"
                        data-cy="login-email-input"
                        @input="$v.credentials.email.$touch"
                        @blur="$v.credentials.email.$touch"
                        @keyup="clearServerErrors('login')"
                    />
                    <v-text-field
                        v-model="credentials.password"
                        prepend-icon="mdi-lock"
                        label="Password"
                        error-count="2"
                        required
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPassword ? 'text' : 'password'"
                        :error-messages="passwordErrors"
                        data-cy="login-password-input"
                        @keyup.enter="loginRequest"
                        @click:append="showPassword = !showPassword"
                        @input="$v.credentials.password.$touch"
                        @blur="$v.credentials.password.$touch"
                        @keyup="clearServerErrors('password')"
                    />
                </v-form>
                <v-divider class="mt-6"></v-divider>
                <v-card-actions class="justify-center">
                    <v-btn data-cy="login-button" class="login-button ma-3" color="info" @click="loginRequest"
                        >Login</v-btn
                    >
                </v-card-actions>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import loginValidatorMixin from '@/validators/auth/loginValidator.mixin';

import NotificationService from '@/services/NotificationService';

export default {
    mixins: [loginValidatorMixin],
    data() {
        return {
            showPassword: false,
            credentials: {
                email: '',
                password: ''
            }
        };
    },
    methods: {
        async loginRequest() {
            try {
                this.$v.$touch();

                if (!this.isValid) {
                    return;
                }

                const { data } = await this.$auth.loginWith('local', { data: this.credentials });

                await this.$auth.setUser(data.loggedUser);

                NotificationService.loggedIn();
            } catch (error) {
                if (!this.checkForServerFormErrors(error)) {
                    NotificationService.handleError(error);
                }

                console.error(error);
            }
        }
    }
};
</script>
