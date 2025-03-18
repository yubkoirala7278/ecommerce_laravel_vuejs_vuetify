<script setup>
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth";

// Access the auth store
const authStore = useAuthStore();

// Reactive properties
const email = ref("");

// Handle the forget password form submission
const handleForgetPassword = async () => {
    // Call the store method to handle the forgot password logic
    await authStore.handleForgetPassword(email.value);
    // Reset email and display success message
    email.value = "";
};
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
                        <h4 class="mx-auto">Forget Password</h4>
                    </v-card-title>
                    <v-card-text class="pa-4">
                        <v-form @submit.prevent="handleForgetPassword">
                            <v-text-field v-model="email" label="Email address" type="email"
                                placeholder="Enter your email" id="email" variant="outlined" class="mb-4"
                                :error-messages="authStore.authErrors.email?.[0] || ''"></v-text-field>

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