<script setup>
import { ref } from "vue";

// Stats data
const stats = ref([
    { title: "Revenue", value: "$24,500", icon: "mdi-currency-usd", color: "teal lighten-1" },
    { title: "Orders", value: "152", icon: "mdi-cart-outline", color: "teal lighten-1" },
    { title: "Customers", value: "1,230", icon: "mdi-account-group-outline", color: "teal lighten-1" },
    { title: "Returns", value: "12", icon: "mdi-arrow-u-left-top", color: "teal lighten-1" },
]);

// Order table headers
const orderHeaders = [
    { text: "Order ID", value: "id" },
    { text: "Customer", value: "customer" },
    { text: "Total", value: "total" },
    { text: "Status", value: "status" },
];

// Sample order data
const orders = [
    { id: "#001", customer: "John Doe", total: "$150", status: "Shipped" },
    { id: "#002", customer: "Jane Smith", total: "$230", status: "Pending" },
    { id: "#003", customer: "Mike Ross", total: "$89", status: "Delivered" },
];

// Performance data
const performance = ref(82);

const viewDetails = () => {
    console.log("Viewing details");
};

const getStatusColor = (status) => {
    switch (status) {
        case "Shipped": return "teal darken-2";
        case "Pending": return "orange darken-1";
        case "Delivered": return "blue darken-1";
        default: return "grey";
    }
};
</script>

<template>
    <v-container fluid class="py-6">
        <!-- Welcome Banner -->
        <v-row>
            <v-col cols="12">
                <v-card color="teal darken-2" dark class="pa-6 rounded-lg">
                    <v-row align="center">
                        <v-col cols="8">
                            <h2 class="font-weight-light">Welcome Back!</h2>
                            <p class="mt-2 text-subtitle-1">Here's your store overview for today.</p>
                        </v-col>
                        <v-col cols="4" class="text-right">
                            <v-btn outlined color="white" @click="viewDetails">View Details</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <!-- Stats Cards -->
        <v-row class="mt-6">
            <v-col v-for="(stat, index) in stats" :key="index" cols="12" sm="6" md="3">
                <v-card class="pa-4 rounded-lg" elevation="3">
                    <v-row align="center">
                        <v-col cols="3">
                            <v-avatar :color="stat.color" size="40">
                                <v-icon color="white">{{ stat.icon }}</v-icon>
                            </v-avatar>
                        </v-col>
                        <v-col cols="9">
                            <p class="text-caption grey--text text--darken-1 mb-1">{{ stat.title }}</p>
                            <h3 class="teal--text text--darken-2 font-weight-medium">{{ stat.value }}</h3>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <!-- Main Content Row -->
        <v-row class="mt-6">
            <!-- Recent Orders -->
            <v-col cols="12" md="7">
                <v-card class="pa-4 rounded-lg" elevation="3">
                    <v-card-title class="text-h6 teal--text text--darken-2">
                        <v-icon class="mr-2" color="teal darken-2">mdi-truck-fast</v-icon>
                        Recent Orders
                    </v-card-title>
                    <v-divider class="mb-4"></v-divider>
                    <v-data-table :headers="orderHeaders" :items="orders" :items-per-page="5" hide-default-footer
                        class="elevation-0">
                        <template v-slot:item.status="{ item }">
                            <v-chip small :color="getStatusColor(item.status)" text-color="white">
                                {{ item.status }}
                            </v-chip>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>

            <!-- Performance Overview -->
            <v-col cols="12" md="5">
                <v-card class="pa-4 rounded-lg" elevation="3">
                    <v-card-title class="text-h6 teal--text text--darken-2">
                        <v-icon class="mr-2" color="teal darken-2">mdi-chart-bar</v-icon>
                        Performance
                    </v-card-title>
                    <v-divider class="mb-4"></v-divider>
                    <v-row justify="center">
                        <v-col cols="8">
                            <v-progress-circular :value="performance" size="100" width="10" color="teal darken-2">
                                <span class="teal--text text--darken-2 text-h6">{{ performance }}%</span>
                            </v-progress-circular>
                        </v-col>
                    </v-row>
                    <p class="text-center mt-4 grey--text text--darken-1">Store Performance</p>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.rounded-lg {
    border-radius: 10px;
}

.grey.lighten-4 {
    background-color: #F7FAFC !important;
}

.v-card {
    transition: box-shadow 0.3s ease;
}

.v-card:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.v-data-table {
    background: transparent !important;
}

.v-divider {
    border-color: rgba(0, 0, 0, 0.1);
}
</style>
