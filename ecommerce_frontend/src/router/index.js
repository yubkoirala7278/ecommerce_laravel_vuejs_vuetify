import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
const routes = [
    {
        path: "/",
        name: "Frontend",
        component: () => import("../components/frontend/layouts/FrontendLayout.vue"),
        children: [
            {
                path: "",
                name: "Home",
                component: () => import("../components/frontend/Home.vue"),
            },
        ],
    },
    {
        path: "/auth",
        name: "Auth",
        component: () => import("../components/auth/layouts/AuthLayout.vue"),
        children: [
            {
                path: "/login",
                name: "Login",
                component: () => import("../components/auth/Login.vue"),
                meta: { guestOnly: true },
            },
            {
                path: "/register",
                name: "Register",
                component: () => import("../components/auth/Register.vue"),
                meta: { guestOnly: true },
            },
            {
                path: "/forget-password",
                name: "ForgetPassword",
                component: () => import("../components/auth/ForgetPassword.vue"),
                meta: { guestOnly: true },
            },
            {
                path: "/password-reset/:token",
                name: "ResetPassword",
                component: () => import("../components/auth/ResetPassword.vue"),
                meta: { guestOnly: true },
            },
        ],
    },
    {
        path: "/admin",
        name: "Admin",
        component: () => import("../components/backend/layouts/BackendLayout.vue"),
        children: [
            {
                path: "home",
                name: "Dashboard",
                component: () => import("../components/backend/Home.vue"),
                meta: { requiresAuth: true },
            },
            {
                path: "category",
                name: "Category",
                component: () => import("../components/backend/category/Category.vue"),
                meta: { requiresAuth: true },
            },
        ],
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
// Global Navigation Guard
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore(); // Access the auth store
    // Fetch the authenticated user if not already loaded
    if (!authStore.authUser) {
        await authStore.getUser(); // Fetch the user information from the backend
    }
    // Handle protected routes
    if (to.meta.requiresAuth && !authStore.authUser) {
        // Redirect to login if the user is not authenticated
        return next({ name: "Login" });
    }
    // Handle guest-only routes (e.g., /login, /register)
    if (to.meta.guestOnly && authStore.authUser) {
        // Redirect authenticated users to the dashboard
        return next({ name: "Dashboard" });
    }
    // Reset the fields on every route change
    authStore.resetFields();
    // Allow navigation
    next();
});
export default router;