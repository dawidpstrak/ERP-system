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
                        @input="$v.credentials.email.$touch()"
                        @blur="$v.credentials.email.$touch()"
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
                        @keyup.enter="loginRequest"
                        @click:append="showPassword = !showPassword"
                        @input="$v.credentials.password.$touch()"
                        @blur="$v.credentials.password.$touch()"
                        @keyup="clearServerErrors('password')"
                    ></v-text-field>
                </v-form>
                <v-divider class="mt-6"></v-divider>
                <v-card-actions class="justify-center">
                    <v-btn class="login-button ma-3" color="info" @click="loginRequest">Login</v-btn>
                </v-card-actions>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import NotifyingService from '@/services/NotifyingService';
import loginValidatorMixin from '@/validators/auth/loginValidator.mixin';

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
        ...mapActions(['login']),
        async loginRequest() {
            try {
                this.$v.$touch();

                if (!this.isValid) {
                    return;
                }

                await this.login(this.credentials);

                NotifyingService.loggedIn();

                this.$router.push({ name: 'dashboard' });
            } catch (error) {
                if (!this.checkForServerFormErrors(error)) {
                    NotifyingService.handleError(error);
                }

                console.error(error);
            }
        }
    }
};
</script>
