import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import router from "../router";

export const useAuthStore = defineStore("auth", () => {
    // ==========state===========
    const authUser = ref(null);
    const authErrors = ref([]);
    const authStatus = ref(null);
    const loading = ref(false);
    const emailVerified = ref(false);

    // ============Fetch the CSRF token==========
    const getToken = async () => {
        await axios.get("/sanctum/csrf-cookie");
    };

    // =========Get authenticated user============
    const getUser = async () => {
        try {
            await getToken();
            const { data } = await axios.get("/api/user");
            authUser.value = data;
            emailVerified.value = data.email_verified_at !== null;
        } catch (error) {
            authUser.value = null;
            emailVerified.value = false;
        }
    };

    // ==========Handle user login===========
    const handleLogin = async (credentials) => {
        try {
            loading.value = true;
            await getToken();
            await axios.post("/login", credentials);
            await getUser();
            if (emailVerified.value) {
                router.push("/admin/home");
            } else {
                router.push("/verify-email");
            }
        } catch (error) {
            if (error.response?.status === 422) {
                authErrors.value = error.response.data.errors;
            }
        } finally {
            loading.value = false;
        }
    };

    // =========Handle user registration==========
    const handleRegister = async (userDetails) => {
        try {
            loading.value = true;
            await getToken();
            await axios.post("/register", userDetails);
            await getUser();
            router.push("/verify-email");
        } catch (error) {
            if (error.response?.status === 422) {
                authErrors.value = error.response.data.errors;
            }
        } finally {
            loading.value = false;
        }
    };

    // =========Handle user logout=========
    const handleLogout = async () => {
        try {
            await axios.post("/logout");
            authUser.value = null;
            emailVerified.value = false;
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // =========Handle forget password==========
    const handleForgetPassword = async (email) => {
        try {
            loading.value = true;
            await getToken();
            const response = await axios.post("/forgot-password", { email });
            authStatus.value = response.data.status;
        } catch (error) {
            if (error.response?.status === 422) {
                authErrors.value = error.response.data.errors;
            }
        } finally {
            loading.value = false;
        }
    };

    // ==========Handle reset password===========
    const handleResetPassword = async (resetData) => {
        try {
            loading.value = true;
            await getToken();
            const response = await axios.post("/reset-password", resetData);
            authStatus.value = response.data.status;
            router.push("/login");
        } catch (error) {
            if (error.response?.status === 422) {
                authErrors.value = error.response.data.errors;
            }
        } finally {
            loading.value = false;
        }
    };

    // ===========handle to resend verify email link=======
    const resendVerification = async () => {
        try {
            loading.value = true;
            await getToken();
            const response = await axios.post("/email/verification-notification");
            authStatus.value = response.data.message;
        } catch (error) {
            authErrors.value = error.response?.data.errors || ['Failed to resend email'];
        } finally {
            loading.value = false;
        }
    };

    // ========handle reset fields=========
    const resetFields = () => {
        authErrors.value = [];
        authStatus.value = null;
        loading.value = false;
    };

    return {
        authUser,
        authErrors,
        getUser,
        handleLogin,
        handleRegister,
        handleLogout,
        handleForgetPassword,
        resetFields,
        handleResetPassword,
        authStatus,
        loading,
        emailVerified,
        resendVerification,
    };
});