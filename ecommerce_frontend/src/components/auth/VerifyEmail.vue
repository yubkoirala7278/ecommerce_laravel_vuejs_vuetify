<script setup>
import { useAuthStore } from "../../stores/auth";
import { onMounted } from "vue";
import router from "../../router";

const authStore = useAuthStore();

onMounted(async () => {
    const interval = setInterval(async () => {
        await authStore.getUser();
        if (authStore.emailVerified) {
            clearInterval(interval);
            router.push("/admin/home");
        }
    }, 2000);
});
</script>

<template>
    <v-container class="fill-height d-flex align-center justify-center">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="5">
                <v-card elevation="10" class="pa-5 rounded-xl">
                    <v-card-title class="text-center">
                        <h3 class="font-weight-bold text-primary">Verify Your Email</h3>
                    </v-card-title>
                    <v-card-text>
                        <p class="text-center">
                            A verification link has been sent to {{ authStore.authUser.email }}.
                            Please check your inbox and click the link to verify your email.
                        </p>
                        <v-btn color="primary" block class="rounded-lg text-capitalize py-3 mt-4"
                            :loading="authStore.loading" :disabled="authStore.loading"
                            @click="authStore.resendVerification">
                            {{ authStore.loading ? "Resending..." : "Resend Verification Email" }}
                        </v-btn>
                        <div class="text-center mt-4">
                            <v-btn text @click="authStore.handleLogout" class="text-caption">
                                Sign Out
                            </v-btn>
                        </div>
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