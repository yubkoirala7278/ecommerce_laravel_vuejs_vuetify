<script setup>
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth";

// Access the authentication store
const authStore = useAuthStore();

// Properties
const form = ref({
  email: "",
  password: "",
});
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="5">
        <v-card elevation="10" class="pa-5 rounded-xl">
          <v-card-title class="text-center">
            <h3 class="font-weight-bold text-primary">Sign In</h3>
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="authStore.handleLogin(form)">
              <v-text-field v-model="form.email" label="Email Address" type="email" placeholder="Enter your email"
                id="email" variant="outlined" class="mb-3 rounded-lg" density="comfortable"
                :error-messages="authStore.authErrors.email?.[0] || ''">
              </v-text-field>

              <v-text-field v-model="form.password" label="Password" type="password" placeholder="Enter your password"
                id="password" variant="outlined" class="mb-3 rounded-lg" density="comfortable"
                :error-messages="authStore.authErrors.password?.[0] || ''">
              </v-text-field>

              <div class="d-flex justify-space-between mb-3">
                <router-link :to="{ name: 'ForgetPassword' }" class="text-primary text-decoration-none text-caption">
                  Forgot Password?
                </router-link>
              </div>

              <v-btn type="submit" color="primary" block class="rounded-lg text-capitalize py-3"
                :loading="authStore.loading" :disabled="authStore.loading">
                {{ authStore.loading ? "Signing in..." : "Login" }}
              </v-btn>
            </v-form>

            <div class="text-center mt-4">
              <p class="mb-0 text-caption">
                Not a member yet?
                <router-link :to="{ name: 'Register' }" class="text-primary font-weight-medium">
                  Sign Up
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
