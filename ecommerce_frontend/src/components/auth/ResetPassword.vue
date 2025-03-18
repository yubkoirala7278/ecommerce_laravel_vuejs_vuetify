<script setup>
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRoute } from "vue-router";

// Access the auth store and route
const authStore = useAuthStore();
const route = useRoute();

// Reactive properties
const form = ref({
    password: "",
    password_confirmation: "",
    email: route.query.email,
    token: route.params.token,
});
</script>

<template>
    <v-container class="py-5">
        <v-row justify="center">
            <v-col cols="12" md="6">
                <v-alert v-if="authStore.authStatus" type="success" class="mb-4" text>
                    {{ authStore.authStatus }}
                </v-alert>
                <v-card elevation="8" class="border-0">
                    <v-card-title class="bg-primary white--text text-center">
                        <h4 class="mx-auto">Reset Password</h4>
                    </v-card-title>
                    <v-card-text class="pa-4">
                        <v-form @submit.prevent="authStore.handleResetPassword(form)">
                            <v-text-field v-model="form.password" label="New Password" type="password"
                                placeholder="Enter your password" id="password" variant="outlined" class="mb-4"
                                :error-messages="authStore.authErrors.password?.[0] || authStore.authErrors.email?.[0] || ''
                                    "></v-text-field>

                            <v-text-field v-model="form.password_confirmation" label="Re-enter Password" type="password"
                                placeholder="Re-enter your password" id="password_confirmation" variant="outlined"
                                class="mb-4"></v-text-field>

                            <v-btn type="submit" color="primary" block class="mb-3" :loading="authStore.loading"
                                :disabled="authStore.loading">
                                {{ authStore.loading ? "Loading..." : "Submit" }}
                            </v-btn>
                        </v-form>
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