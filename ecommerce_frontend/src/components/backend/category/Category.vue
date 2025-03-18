<script setup>
import { ref, watch } from "vue";
import { useCategoryStore } from "../../../stores/category";
import debounce from "lodash/debounce";

const categoryStore = useCategoryStore();

// Table state
const page = ref(1);
const itemsPerPage = ref(10);
const search = ref("");
const sortBy = ref([{ key: "updated_at", order: "desc" }]);
const statusFilter = ref("");
const selectedCategories = ref([]); // New state for selected categories

// Image Modal state
const showImageModal = ref(false);
const selectedImage = ref(null);
const hoverImage = ref(false);

// Add/Edit Modal state
const showAddModal = ref(false);
const newCategory = ref({ name: "", status: "active", image: null });
const addForm = ref(null);
const serverErrors = ref({ name: [], status: [], image: [] });

// Edit Modal trigger
const showEditModal = ref(false);

// Validation rules
const rules = {
    name: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 255) || "Name must be less than 255 characters",
    ],
    status: [
        (v) => !!v || "Status is required",
        (v) => ["active", "inactive"].includes(v) || "Status must be 'active' or 'inactive'",
    ],
    image: [
        (v) => !!v || "Image is required",
        (v) => !v || v.size <= 2 * 1024 * 1024 || "Image must be less than 2MB",
    ],
};

// Table headers with checkbox
const headers = [
    { 
        title: "", 
        key: "data-table-select", 
        sortable: false, 
        width: "50px" 
    },
    { title: "Image", key: "image", sortable: false },
    { title: "Name", key: "name", sortable: true },
    { title: "Status", key: "status", sortable: true },
    { title: "Created At", key: "created_at", sortable: true },
    { title: "Actions", key: "actions", sortable: false },
];

// Load items from server
const loadItems = debounce(async (options) => {
    page.value = options.page;
    itemsPerPage.value = options.itemsPerPage;
    sortBy.value = options.sortBy.length ? options.sortBy : [{ key: "created_at", order: "desc" }];

    const sort = sortBy.value[0];
    await categoryStore.fetchCategories(
        page.value,
        itemsPerPage.value,
        search.value,
        sort.key,
        sort.order,
        statusFilter.value
    );
}, 300);

// Debounced search and status filter
const updateFilters = debounce(() => {
    page.value = 1;
    loadItems({ page: page.value, itemsPerPage: itemsPerPage.value, sortBy: sortBy.value });
}, 500);

// Watch filters
watch([search, statusFilter], updateFilters);

// Image modal handlers
const openImageModal = (imageUrl) => {
    selectedImage.value = imageUrl;
    showImageModal.value = true;
};

// Add modal handlers
const resetNewCategory = () => ({
    name: "",
    status: "active",
    image: null,
});

const openAddModal = () => {
    newCategory.value = resetNewCategory();
    categoryStore.resetErrors();
    serverErrors.value = { name: [], status: [], image: [] };
    showAddModal.value = true;
};

const closeAddModal = () => {
    showAddModal.value = false;
};

// Edit modal handlers
const openEditModal = async (slug) => {
    try {
        await categoryStore.fetchCategory(slug);
        newCategory.value = {
            slug: slug,
            name: categoryStore.currentCategory.name,
            status: categoryStore.currentCategory.status,
            image: null
        };
        categoryStore.resetErrors();
        serverErrors.value = { name: [], status: [], image: [] };
        showEditModal.value = true;
    } catch (error) {
        console.error('Error opening edit modal:', error);
    }
};

const closeEditModal = () => {
    showEditModal.value = false;
    newCategory.value = resetNewCategory();
};

// Submit new category
const submitCategory = async () => {
    const { valid } = await addForm.value.validate();
    if (!valid) return;

    const formData = new FormData();
    formData.append("name", newCategory.value.name);
    formData.append("status", newCategory.value.status);
    if (newCategory.value.image) formData.append("image", newCategory.value.image);

    try {
        await categoryStore.storeCategory(formData);
        showAddModal.value = false;
        page.value = 1;
        sortBy.value = [{ key: "created_at", order: "desc" }];
        await loadItems({ page: page.value, itemsPerPage: itemsPerPage.value, sortBy: sortBy.value });
    } catch (error) {
        if (categoryStore.categoryErrors) {
            serverErrors.value = {
                name: categoryStore.categoryErrors.name || [],
                status: categoryStore.categoryErrors.status || [],
                image: categoryStore.categoryErrors.image || [],
            };
        }
    }
};

// Submit edited category
const submitEditCategory = async () => {
    const { valid } = await addForm.value.validate();
    if (!valid) return;

    const formData = new FormData();
    formData.append("name", newCategory.value.name);
    formData.append("status", newCategory.value.status);
    if (newCategory.value.image) formData.append("image", newCategory.value.image);

    try {
        await categoryStore.updateCategory(newCategory.value.slug, formData);
        showEditModal.value = false;
        await loadItems({ page: page.value, itemsPerPage: itemsPerPage.value, sortBy: sortBy.value });
    } catch (error) {
        if (categoryStore.categoryErrors) {
            serverErrors.value = {
                name: categoryStore.categoryErrors.name || [],
                status: categoryStore.categoryErrors.status || [],
            };
        }
    }
};

// Status chip color
const getStatusColor = (status) => (status === "active" ? "green" : "red");

// CRUD operations
const editCategory = (slug) => {
    openEditModal(slug);
};

const deleteCategory = async (slug) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
        await categoryStore.deleteCategory(slug);
        await loadItems({ page: page.value, itemsPerPage: itemsPerPage.value, sortBy: sortBy.value });
    } catch (error) {
        alert("Failed to delete category. Please try again.");
        await loadItems({ page: page.value, itemsPerPage: itemsPerPage.value, sortBy: sortBy.value });
    }
};

// Multiple delete handler
const deleteMultipleCategories = async () => {
    if (!confirm("Are you sure you want to delete the selected categories?")) return;
    try {
        await categoryStore.deleteMultipleCategories(selectedCategories.value);
        selectedCategories.value = []; // Clear selection
        await loadItems({ page: page.value, itemsPerPage: itemsPerPage.value, sortBy: sortBy.value });
    } catch (error) {
        alert("Failed to delete categories. Please try again.");
        await loadItems({ page: page.value, itemsPerPage: itemsPerPage.value, sortBy: sortBy.value });
    }
};
</script>

<template>
    <v-container class="py-6">
        <!-- Filters and Search -->
        <v-card class="pa-4 mb-4 rounded-lg elevation-2">
            <v-row align="center" justify="space-between">
                <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="search" label="Search Categories" prepend-inner-icon="mdi-magnify"
                        variant="outlined" clearable density="comfortable" class="rounded-lg" />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                    <v-select v-model="statusFilter" :items="[
                        { title: 'All', value: '' },
                        { title: 'Active', value: 'active' },
                        { title: 'Inactive', value: 'inactive' }
                    ]" label="Filter by Status" prepend-inner-icon="mdi-filter" variant="outlined"
                        density="comfortable" class="rounded-lg" clearable />
                </v-col>
                <v-spacer />
                <v-col cols="12" sm="auto">
                    <v-btn color="teal-darken-2" dark class="rounded-lg px-4 mr-2" @click="openAddModal">
                        <v-icon left>mdi-plus</v-icon> Add Category
                    </v-btn>
                    <v-btn color="red-darken-2" dark class="rounded-lg px-4" 
                           :disabled="selectedCategories.length === 0"
                           @click="deleteMultipleCategories">
                        <v-icon left>mdi-delete</v-icon> Delete Selected
                    </v-btn>
                </v-col>
            </v-row>
        </v-card>

        <!-- Data Table -->
        <v-card class="rounded-lg elevation-2">
            <v-data-table-server 
                v-model:items-per-page="itemsPerPage" 
                :headers="headers"
                :items="categoryStore.categories" 
                :items-length="categoryStore.pagination.total || 0"
                :loading="categoryStore.loading" 
                item-value="slug" 
                v-model:sort-by="sortBy"
                v-model="selectedCategories"
                show-select
                :items-per-page-options="[5, 10, 20, 50]" 
                @update:options="loadItems">
                <template v-slot:item.image="{ item }">
                    <v-img v-if="item.image" :src="item.image" height="40" width="40"
                        class="my-2 rounded-lg cursor-pointer" @click="openImageModal(item.image)" />
                    <span v-else>No Image</span>
                </template>
                <template v-slot:item.status="{ item }">
                    <v-chip :color="getStatusColor(item.status)" small class="text-uppercase font-weight-bold">
                        {{ item.status }}
                    </v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-btn icon color="warning" size="small" @click="editCategory(item.slug)">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon color="red-darken-2" size="small" class="ms-2" @click="deleteCategory(item.slug)">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </template>
            </v-data-table-server>
        </v-card>

        <!-- Image Modal -->
        <v-dialog v-model="showImageModal" max-width="500">
            <v-card class="rounded-lg elevation-3">
                <v-card-title class="d-flex align-center" style="background: linear-gradient(45deg, #00695c, #00897b)">
                    <span class="text-h6 font-weight-bold text-white">Category Image</span>
                    <v-spacer />
                    <v-btn icon @click="showImageModal = false" variant="plain">
                        <v-icon color="white">mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="text-center py-4">
                    <v-img :src="selectedImage" max-height="400" contain class="mx-auto rounded-lg" />
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Add Category Modal -->
        <v-dialog v-model="showAddModal" max-width="500" persistent transition="dialog-bottom-transition">
            <v-card rounded="xl" elevation="12">
                <v-card-title class="py-4 px-6" style="background: linear-gradient(45deg, #00695c, #00897b)">
                    <v-row align="center">
                        <v-col>
                            <span class="text-h6 font-weight-medium text-white">Add New Category</span>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn icon @click="closeAddModal" variant="text" color="white" class="mt-n1">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text class="pa-6">
                    <v-form ref="addForm" @submit.prevent="submitCategory" class="d-flex flex-column gap-4">
                        <!-- category name -->
                        <v-text-field v-model="newCategory.name" label="Category Name" prepend-icon="mdi-tag"
                            density="comfortable" variant="outlined" color="teal-darken-2" class="rounded-lg mb-4"
                            :rules="rules.name" required :error-messages="serverErrors.name" />
                            <!-- select category status -->
                        <v-select v-model="newCategory.status" :items="[
                            { title: 'Active', value: 'active' },
                            { title: 'Inactive', value: 'inactive' }
                        ]" label="Status" prepend-icon="mdi-toggle-switch" density="comfortable" variant="outlined"
                            color="teal-darken-2" class="rounded-lg mb-4" :rules="rules.status" required
                            :error-messages="serverErrors.status" />
                            <!-- upload category image -->
                        <v-file-input v-model="newCategory.image" label="Category Image" prepend-icon="mdi-image"
                            accept="image/*" density="comfortable" variant="outlined" class="rounded-lg mb-4"
                            color="teal-darken-2" :error-messages="serverErrors.image" />
                            <!-- create new category -->
                        <v-btn type="submit" color="teal-darken-2" variant="flat" size="large" block
                            :loading="categoryStore.loading" class="mt-4 rounded-lg" elevation="2">
                            Save Category
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Edit Category Modal -->
        <v-dialog v-model="showEditModal" max-width="500" persistent transition="dialog-bottom-transition">
            <v-card rounded="xl" elevation="12">
                <v-card-title class="py-4 px-6" style="background: linear-gradient(45deg, #00695c, #00897b)">
                    <v-row align="center">
                        <v-col>
                            <span class="text-h6 font-weight-medium text-white">Edit Category</span>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn icon @click="closeEditModal" variant="text" color="white" class="mt-n1">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text class="pa-6">
                    <v-form ref="addForm" @submit.prevent="submitEditCategory" class="d-flex flex-column gap-4">
                        <!-- category name -->
                        <v-text-field v-model="newCategory.name" label="Category Name" prepend-icon="mdi-tag"
                            density="comfortable" variant="outlined" color="teal-darken-2" class="rounded-lg mb-4"
                            :rules="rules.name" required :error-messages="serverErrors.name" />
                            <!-- select category status -->
                        <v-select v-model="newCategory.status" :items="[
                            { title: 'Active', value: 'active' },
                            { title: 'Inactive', value: 'inactive' }
                        ]" label="Status" prepend-icon="mdi-toggle-switch" density="comfortable" variant="outlined"
                            color="teal-darken-2" class="rounded-lg mb-4" :rules="rules.status" required
                            :error-messages="serverErrors.status" />
                            <!-- upload category image -->
                        <v-file-input v-model="newCategory.image" label="Category Image" prepend-icon="mdi-image"
                            accept="image/*" density="comfortable" variant="outlined" class="rounded-lg mb-4"
                            color="teal-darken-2" :error-messages="serverErrors.image" />
                            <!-- update category -->
                        <v-btn type="submit" color="teal-darken-2" variant="flat" size="large" block
                            :loading="categoryStore.loading" class="mt-4 rounded-lg" elevation="2">
                            Update Category
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>