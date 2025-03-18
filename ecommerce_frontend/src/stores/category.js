// src/stores/category.js
import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios"; // Assuming your axios configuration is here

export const useCategoryStore = defineStore("category", () => {
    // ========= State =========
    const categories = ref([]); // List of all categories
    const currentCategory = ref(null); // Single category for view/edit
    const categoryErrors = ref([]); // Validation or API errors
    const loading = ref(false); // Loading state for async operations
    const pagination = ref({}); // Pagination metadata

    // ======= Fetch all categories (View/List) =======
    const fetchCategories = async (page = 1, perPage = 10, search = '', sortBy = 'updated_at', sortDirection = 'desc', status = '') => {
        try {
            loading.value = true;

            // Start with basic params
            const params = {
                page,
                per_page: perPage,
                sort_by: sortBy,
                sort_direction: sortDirection,
            };

            // Add 'search' to params if it's provided
            if (search) {
                params.search = encodeURIComponent(search);
            }

            // Add 'status' to params if it's provided
            if (status) {
                params.status = encodeURIComponent(status);
            }

            // Build the query string
            const query = new URLSearchParams(params).toString();

            // Fetch data using axios
            const response = await axios.get(`/api/categories?${query}`);
            console.log('Full API Response:', response.data);

            // Set the categories and pagination values
            categories.value = response.data.data || [];
            pagination.value = response.data.meta;

            return response;  // Return full response for consistency
        } catch (error) {
            console.error("Fetch error:", error.response?.data || error.message);

            // Reset values on error
            categories.value = [];
            pagination.value = { total: 0, current_page: 1, last_page: 1, per_page: perPage };

            throw error;
        } finally {
            loading.value = false;
        }
    };


    // ======= Fetch a single category (View/Edit) =======
    const fetchCategory = async (slug) => {
        try {
            loading.value = true;
            const response = await axios.get(`/api/categories/${slug}`);
            currentCategory.value = response.data.data;
        } catch (error) {
            console.error("Error fetching category:", error);
            categoryErrors.value = error.response?.data?.errors || ["Category not found"];
            currentCategory.value = null;
        } finally {
            loading.value = false;
        }
    };

    // ======= Store/Create a new category =======
    const storeCategory = async (categoryData) => {
        try {
            loading.value = true;
            categoryErrors.value = [];
            const response = await axios.post("/api/categories", categoryData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const newCategory = response.data.data;
            return newCategory;
        } catch (error) {
            if (error.response && error.response.status === 422) {
                categoryErrors.value = error.response.data.errors;
            } else {
                console.error("Error creating category:", error);
            }
            throw error;
        } finally {
            loading.value = false;
        }
    };

    // ======= Update an existing category =======
    const updateCategory = async (slug, categoryData) => {
        try {
            loading.value = true;
            categoryErrors.value = [];
            categoryData.append('_method', 'PUT');
            const response = await axios.post(`/api/categories/${slug}`, categoryData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const updatedCategory = response.data.data;
            return updatedCategory; // Return updated category for local update
        } catch (error) {
            if (error.response && error.response.status === 422) {
                categoryErrors.value = error.response.data.errors;
            } else {
                console.error("Error updating category:", error);
            }
            throw error;
        } finally {
            loading.value = false;
        }
    };

    // ======= Delete a category =======
    const deleteCategory = async (slug) => {
        try {
            loading.value = true;
            await axios.delete(`/api/categories/${slug}`);
            return slug;
        } catch (error) {
            console.error("Delete error:", error.response?.data || error.message);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    // ==========Delete multiple categories=========
    const deleteMultipleCategories = async (slugs) => {
        try {
            loading.value = true;
            await axios.delete("/api/categories/multiple", {
                data: { slugs } // Ensure slugs are sent in the request body
            });
        } catch (error) {
            console.error("Delete multiple error:", error.response?.data || error.message);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    // ======= Reset errors =======
    const resetErrors = () => {
        categoryErrors.value = [];
    };

    // ======= Return state and actions =======
    return {
        categories,
        currentCategory,
        categoryErrors,
        loading,
        pagination,
        fetchCategories,
        fetchCategory,
        storeCategory,
        updateCategory,
        deleteCategory,
        deleteMultipleCategories,
        resetErrors,
    };
});