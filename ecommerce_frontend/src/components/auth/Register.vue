<script setup>
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth";

// Access the authentication store
const authStore = useAuthStore();

// Properties
const form = ref({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
});
</script>

<template>
    <v-container class="py-5">
        <v-row justify="center">
            <v-col cols="12" md="6">
                <v-card elevation="8" class="border-0">
                    <v-card-title class="bg-primary white--text text-center">
                        <h4 class="mx-auto">Register</h4>
                    </v-card-title>
                    <v-card-text class="pa-4">
                        <v-form @submit.prevent="authStore.handleRegister(form)">
                            <v-text-field v-model="form.name" label="Name" type="text"
                                placeholder="Enter your full name" id="name" variant="outlined" class="mb-4"
                                :error-messages="authStore.authErrors.name?.[0] || ''"></v-text-field>

                            <v-text-field v-model="form.email" label="Email address" type="email"
                                placeholder="Enter your email" id="email" variant="outlined" class="mb-4"
                                :error-messages="authStore.authErrors.email?.[0] || ''"></v-text-field>

                            <v-text-field v-model="form.password" label="Password" type="password"
                                placeholder="Enter your password" id="password" variant="outlined" class="mb-4"
                                :error-messages="authStore.authErrors.password?.[0] || ''"></v-text-field>

                            <v-text-field v-model="form.password_confirmation" label="Password Confirmation"
                                type="password" placeholder="Re-enter your password" id="password_confirmation"
                                variant="outlined" class="mb-4"></v-text-field>

                            <v-btn type="submit" color="primary" block class="mb-3" :loading="authStore.loading"
                                :disabled="authStore.loading">
                                {{ authStore.loading ? "Loading..." : "Register" }}
                            </v-btn>
                        </v-form>

                        <div class="text-center">
                            <p class="mb-0">
                                Already have an account?
                                <router-link :to="{ name: 'Login' }"
                                    class="text-decoration-none primary--text font-weight-bold">
                                    Sign In
                                </router-link>
                            </p>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
/* Optional: Add custom styles if needed */
.bg-primary {
    background-color: #1976d2 !important;
    /* Vuetify primary color */
}

.white--text {
    color: white !important;
}
</style>