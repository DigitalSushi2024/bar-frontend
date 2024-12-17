<template>
  <div class="pending-orders">
    <h1>🍽️ Pending bar Orders</h1>

    <!-- Notificatiebalk -->
    <div v-if="notification.message" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>

    <!-- Instellingen -->
    <div class="settings">
      <button @click="toggleOrderDirection" class="btn primary">
        Sorteer: {{ orderDirection === 'asc' ? 'Oplopend' : 'Aflopend' }}
      </button>
    </div>

    <!-- Geen orders -->
    <div v-if="pendingOrders.length === 0" class="no-orders">
      <p>No pending orders. 🎉</p>
    </div>

    <!-- Grid met orders -->
    <div class="order-list">
      <div
          v-for="order in displayedOrders"
          :key="order.orderId"
          class="order-card"
          :class="{ expanded: expandedOrders.includes(order.orderId) }"
      >
        <h2>Order #{{ order.orderId }}</h2>
        <div class="order-items">
          <button
              v-for="(item, index) in getVisibleItems(order)"
              :key="item.itemId"
              class="btn item"
              :class="{ completed: item.completed }"
              @click="toggleItemStatus(order, item)"
          >
            {{ item.productName }} (x{{ item.quantity }})
            <span v-if="item.completed" class="checkmark">✔</span>
          </button>
        </div>
        <!-- Toon meer knop -->
        <button
            v-if="order.orderItems.length > 4"
            class="btn toggle-btn"
            @click="toggleExpandOrder(order.orderId)"
        >
          {{ expandedOrders.includes(order.orderId) ? 'Toon minder' : 'Toon meer' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from "../services/apiServices";

export default {
  data() {
    return {
      pendingOrders: [],
      locationId: 1,
      orderDirection: "asc",
      notification: { message: "", type: "" },
      expandedOrders: [], // Bijhouden welke orders zijn uitgebreid
    };
  },
  computed: {
    displayedOrders() {
      return this.orderDirection === "asc"
          ? [...this.pendingOrders]
          : [...this.pendingOrders].reverse();
    },
  },
  methods: {
    async loadPendingOrders() {
      try {
        const response = await apiService.getPendingOrdersWithLocation();
        const orders = response.data?.$values || [];
        this.pendingOrders = this.groupOrdersByOrderId(orders);
      } catch (error) {
        this.showNotification("Error loading orders.", "error");
      }
    },
    groupOrdersByOrderId(orders) {
      const grouped = [];
      orders.forEach((order) => {
        let existingOrder = grouped.find((o) => o.orderId === order.orderId);
        if (!existingOrder) {
          existingOrder = {
            orderId: order.orderId,
            locationId: this.locationId,
            orderItems: [],
          };
          grouped.push(existingOrder);
        }
        existingOrder.orderItems.push({
          itemId: order.itemId,
          productName: order.productName,
          quantity: order.quantity,
          completed: false,
        });
      });
      return grouped;
    },
    toggleOrderDirection() {
      this.orderDirection = this.orderDirection === "asc" ? "desc" : "asc";
    },
    toggleItemStatus(order, item) {
      item.completed = !item.completed;

      if (this.areAllItemsComplete(order.orderItems)) {
        this.markOrderComplete(order);
      }
    },
    areAllItemsComplete(items) {
      return items.every((item) => item.completed);
    },
    markOrderComplete(order) {
      this.showNotification(`Order #${order.orderId} is afgerond!`, "success");

      this.pendingOrders = this.pendingOrders.filter(
          (o) => o.orderId !== order.orderId
      );
    },
    getVisibleItems(order) {
      return this.expandedOrders.includes(order.orderId)
          ? order.orderItems
          : order.orderItems.slice(0, 4); // Toon standaard de eerste 4 items
    },
    toggleExpandOrder(orderId) {
      if (this.expandedOrders.includes(orderId)) {
        this.expandedOrders = this.expandedOrders.filter((id) => id !== orderId);
      } else {
        this.expandedOrders.push(orderId);
      }
    },
    showNotification(message, type) {
      this.notification.message = message;
      this.notification.type = type;

      setTimeout(() => {
        this.notification.message = "";
        this.notification.type = "";
      }, 3000);
    },
  },
  created() {
    this.loadPendingOrders();
  },
};
</script>

<style scoped>
/* Algemene stijl */
.pending-orders {
  padding: 20px;
  font-family: Arial, sans-serif;
  background: #f7f8fa;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.settings {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

/* Notificatiestijl */
.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px 20px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  color: white;
  animation: fadeInOut 3s ease-in-out;
}

.notification.success {
  background-color: #28a745;
}

.notification.error {
  background-color: #dc3545;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  10%, 90% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
}

/* Grid voor de orders */
.order-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.order-card {
  background-color: #fff;
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  min-height: 200px;
}

.order-card.expanded {
  min-height: 350px;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  overflow-y: auto;
}

.btn {
  padding: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn.primary {
  background-color: #007bff;
  color: white;
}

.btn.toggle-btn {
  margin-top: 10px;
  background-color: #17a2b8;
  color: white;
}

.btn.item {
  background-color: #f1f1f1;
  color: #333;
  text-align: center;
}

.btn.item.completed {
  background-color: #28a745;
  color: white;
}
</style>
