<template>
    <v-container fill-height fluid flex-column justify-center>
        <v-card width="400">
            <v-card-title>
                <h1 class="display-1">Login</h1>
            </v-card-title>
            <v-card-text>
                <v-form>
                    <v-text-field
                        v-model="userData.email"
                        label="Email"
                        prepend-icon="mdi-account-circle"
                    ></v-text-field>
                    <v-text-field
                        v-model="userData.password"
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
        <v-alert v-if="error" class="mt-6 alert">{{ this.error }}</v-alert>
    </v-container>
</template>

<script>
import axios from '../../plugins/axios';

export default {
    data() {
        return {
            showPassword: false,
            userData: {
                email: '',
                password: ''
            },
            error: ''
        };
    },
    methods: {
        async loginRequest() {
            try {
                const { data } = await axios.post('auth/login', this.userData);

                if (data) {
                    this.$router.push({ name: 'dashboard' });

                    // todo with vuex
                    // localStorage.setItem('token', data.token);
                    // localStorage.setItem('role', data.user.role);
                }
            } catch (error) {
                this.error = 'Wrong username or password';
            }
        }
    }
};
</script>

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
