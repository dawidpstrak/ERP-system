<template>
    <v-container fill-height fluid flex-column justify-center>
        <v-card width="400">
            <v-card-title>
                <h1 class="display-1">Login</h1>
            </v-card-title>
            <v-card-text>
                <v-form>
                    <v-text-field
                        v-model="credentials.email"
                        label="Email"
                        prepend-icon="mdi-account-circle"
                    />
                    <v-text-field
                        v-model="credentials.password"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        prepend-icon="mdi-lock"
                        :type="showPassword ? 'text' : 'password'"
                        label="Password"
                        @click:append="showPassword = !showPassword"
                    ></v-text-field>
                </v-form>
                <v-divider></v-divider>
                <v-card-actions class="justify-center">
                    <v-btn class="login-button" color="info" @click="loginRequest">Login</v-btn>
                </v-card-actions>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import NotifyingService from '@/services/NotifyingService';

export default {
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
                await this.login(this.credentials);

                NotifyingService.loggedIn();

                this.$router.push({ name: 'dashboard' });
            } catch (error) {
                if (error.response) {
                    NotifyingService.handleError(error);
                }

                console.error(error);
            }
        }
    }
};
</script>

// TODO use vuetify classes insted of styles below
<style scoped>
.login-button {
    margin: 15px 5px;
}
.v-card__text {
    padding-bottom: 0;
}
.alert {
    color: rgb(255, 0, 0);
}
</style>
