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
    <v-container class="fill-height d-flex align-center justify-center">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="5">
                <v-card elevation="10" class="pa-5 rounded-xl">
                    <v-card-title class="text-center">
                        <h3 class="font-weight-bold text-primary">Reset Password</h3>
                    </v-card-title>

                    <v-card-text>
                        <v-alert v-if="authStore.authStatus" type="success" class="mb-4" text>
                            {{ authStore.authStatus }}
                        </v-alert>

                        <v-form @submit.prevent="authStore.handleResetPassword(form)">
                            <v-text-field v-model="form.password" label="New Password" type="password"
                                placeholder="Enter your new password" id="password" variant="outlined"
                                class="mb-3 rounded-lg" density="comfortable"
                                :error-messages="authStore.authErrors.password?.[0] || authStore.authErrors.email?.[0] || ''">
                            </v-text-field>

                            <v-text-field v-model="form.password_confirmation" label="Confirm Password" type="password"
                                placeholder="Re-enter your password" id="password_confirmation" variant="outlined"
                                class="mb-3 rounded-lg" density="comfortable">
                            </v-text-field>

                            <v-btn type="submit" color="primary" block class="rounded-lg text-capitalize py-3"
                                :loading="authStore.loading" :disabled="authStore.loading">
                                {{ authStore.loading ? "Processing..." : "Submit" }}
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.text-primary {
    color: #1976d2 !important;
    /* Vuetify Primary */
}

.rounded-xl {
    border-radius: 16px;
}

/* Ensure full-height centering */
.fill-height {
    min-height: 100vh;
    /* Full screen height */
}
</style>
