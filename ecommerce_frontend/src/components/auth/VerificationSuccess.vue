<script setup>
import { useAuthStore } from "../../stores/auth";
import { onMounted } from "vue";
import router from "../../router";

const authStore = useAuthStore();

onMounted(async () => {
    await authStore.getUser();
    if (authStore.emailVerified) {
        setTimeout(() => router.push("/admin/home"), 2000); // Redirect after 2 seconds
    } else {
        router.push("/verify-email");
    }
});
</script>

<template>
    <v-container class="fill-height d-flex align-center justify-center">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="5">
                <v-card elevation="10" class="pa-5 rounded-xl">
                    <v-card-title class="text-center">
                        <h3 class="font-weight-bold text-primary">Email Verified</h3>
                    </v-card-title>
                    <v-card-text>
                        <p class="text-center">Your email has been successfully verified. Redirecting to dashboard...
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.text-primary {
    color: #1976d2 !important;
}

.rounded-xl {
    border-radius: 16px;
}

.fill-height {
    min-height: 100vh;
}
</style>