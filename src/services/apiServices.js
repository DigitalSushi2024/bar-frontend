import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://localhost:7110/api/Order",
    headers: {
        "Content-Type": "application/json",
    },
});

export default {
    getPendingOrdersWithLocation() {
        return apiClient.get(`/bar/pending`);
    },
    getCompletedBarOrders() {
        return apiClient.get(`/bar/completed`);
    },
    updateOrderStatus(orderId, locationId) {
        return apiClient.put(`/order/${orderId}/location/${locationId}/update-status`);
    },
    setBarOrderToPending(orderId) {
        return apiClient.put(`/order/${orderId}/location/2/set-pending`);
    },

};
