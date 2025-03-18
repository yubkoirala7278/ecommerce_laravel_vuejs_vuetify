import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import router from "../router";
export const useAuthStore = defineStore("auth", () => {
    // ========= State =========
    const authUser = ref(null); // Holds the authenticated user data
    const authErrors = ref([]); // Holds validation or other errors
    const authStatus = ref(null);
    const loading = ref(false);
    // =======Fetch the CSRF token==============
    const getToken = async () => {
        try {
            await axios.get("/sanctum/csrf-cookie");
        } catch (error) {
            console.error("Error fetching CSRF token:", error);
        }
    };
    // ====Handle user login===============
    const handleLogin = async (credentials) => {
        try {
            loading.value = true;
            await getToken(); // Ensure CSRF token is set
            const response = await axios.post("/login", credentials);
            authUser.value = response.data.user;
            router.push("/admin/home");
        } catch (error) {
            if (error.response && error.response.status === 422) {
                authErrors.value = error.response.data.errors;
            }
        } finally {
            loading.value = false;
        }
    };
    // ==========Handle user registration================
    const handleRegister = async (userDetails) => {
        try {
            loading.value = true;
            await getToken(); // Ensure CSRF token is set
            const response = await axios.post("/register", userDetails);
            authUser.value = response.data.user;
            router.push("/admin/home");
        } catch (error) {
            if (error.response && error.response.status === 422) {
                authErrors.value = error.response.data.errors;
            }
        } finally {
            loading.value = false;
        }
    };
    // =======Fetch authenticated user's information==========
    const getUser = async () => {
        try {
            await getToken(); // Ensure CSRF token is set
            const { data } = await axios.get("/api/user");
            authUser.value = data;
        } catch (error) {
            authUser.value = null;
        }
    };
    // =======Handle user logout=============
    const handleLogout = async () => {
        try {
            await axios.post("/logout");
            authUser.value = null;
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    // =====Handle forgot password============
    const handleForgetPassword = async (email) => {
        try {
            loading.value = true;
            await getToken(); // Ensure CSRF token is set
            const response = await axios.post("/forgot-password", { email });
            authStatus.value = response.data.status;
        } catch (error) {
            if (error.response && error.response.status === 422) {
                authErrors.value = error.response.data.errors;
            }
        } finally {
            loading.value = false;
        }
    };
    // =========Handle reset password=============
    const handleResetPassword = async (resetData) => {
        try {
            loading.value = true;
            await getToken(); // Ensure CSRF token is set
            const response = await axios.post("/reset-password", resetData);
            // authUser.value = response.data.user;
            authStatus.value = response.data.status;
            router.push("/login");
        } catch (error) {
            if (error.response && error.response.status === 422) {
                console.log(error.response.data)
                authErrors.value = error.response.data.errors;
            }
        } finally {
            loading.value = false;
        }
    };
    // ===========reset properties===========
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
    };
});