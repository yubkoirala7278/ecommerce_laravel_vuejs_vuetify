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
            {
                path: "/verify-email",
                name: "VerifyEmail",
                component: () => import("../components/auth/VerifyEmail.vue"),
                meta: { requiresAuth: true, unverifiedOnly: true },
            },
            {
                path: "/verification-success",
                name: "VerificationSuccess",
                component: () => import("../components/auth/VerificationSuccess.vue"),
                meta: { requiresAuth: true },
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
                meta: { requiresAuth: true, requiresVerified: true },
            },
            {
                path: "category",
                name: "Category",
                component: () => import("../components/backend/category/Category.vue"),
                meta: { requiresAuth: true, requiresVerified: true },
            },
        ],
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    if (!authStore.authUser) {
        await authStore.getUser();
    }

    if (to.meta.requiresAuth && !authStore.authUser) {
        return next({ name: "Login" });
    }

    if (to.meta.requiresVerified && authStore.authUser && !authStore.emailVerified) {
        return next({ name: "VerifyEmail" });
    }

    if (to.meta.unverifiedOnly && authStore.authUser && authStore.emailVerified) {
        return next({ name: "Dashboard" });
    }

    if (to.meta.guestOnly && authStore.authUser) {
        return next({ name: "Dashboard" });
    }

    authStore.resetFields();
    next();
});

export default router;