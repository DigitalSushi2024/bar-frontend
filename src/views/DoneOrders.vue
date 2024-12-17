<template>
  <div class="completed-orders">
    <h1>🍽️ Completed Bar Orders</h1>

    <!-- Notificatiebalk -->
    <div v-if="notification.message" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>

    <!-- Geen orders beschikbaar -->
    <div v-if="completedOrders.length === 0" class="no-orders">
      <p>No completed orders available.</p>
    </div>

    <!-- Grid van completed orders -->
    <div class="order-list">
      <div
          v-for="order in completedOrders"
          :key="order.orderId"
          class="order-card"
      >
        <h2>Order #{{ order.orderId }}</h2>
        <ul class="order-items">
          <li
              v-for="item in order.orderItems"
              :key="item.itemId"
              class="order-item"
          >
            {{ item.productName }}
          </li>
        </ul>
        <!-- Knop om order terug te zetten naar 'pending' -->
        <button @click="setOrderToPending(order.orderId)" class="btn pending-btn">
          🔄 Set to Pending
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
      completedOrders: [],
      notification: { message: "", type: "" }, // Notificatieobject
    };
  },
  methods: {
    async loadCompletedOrders() {
      try {
        const response = await apiService.getCompletedBarOrders();
        console.log("API Response:", response.data);

        // Groepeer de items op orderId
        const groupedOrders = response.data?.$values?.reduce((acc, item) => {
          const { orderId, orderTime, itemId, productName, quantity } = item;

          // Controleer of de orderId al bestaat, anders voeg een nieuw order toe
          if (!acc[orderId]) {
            acc[orderId] = {
              orderId,
              orderTime,
              orderItems: [],
            };
          }

          // Voeg het item toe aan de orderItems
          acc[orderId].orderItems.push({
            itemId,
            productName,
            quantity,
          });

          return acc;
        }, {});

        // Zet het resultaat om naar een array
        this.completedOrders = Object.values(groupedOrders);
        console.log("Parsed Orders:", this.completedOrders);
      } catch (error) {
        this.showNotification("Error loading completed bar orders.", "error");
        console.error("Load Error:", error);
      }
    },
    async setOrderToPending(orderId) {
      try {
        await apiService.setBarOrderToPending(orderId);
        this.showNotification(`Order ${orderId} is teruggezet naar 'Pending'.`, "success");
        this.loadCompletedOrders(); // Herlaad de lijst
      } catch (error) {
        console.error(`Error resetting order ${orderId}:`, error);
        this.showNotification(`Fout bij het terugzetten van order ${orderId}.`, "error");
      }
    },
    showNotification(message, type) {
      this.notification.message = message;
      this.notification.type = type;

      setTimeout(() => {
        this.notification.message = "";
        this.notification.type = "";
      }, 3000); // Notificatie verdwijnt na 3 seconden
    },
  },
  created() {
    this.loadCompletedOrders();
  },
};
</script>

<style scoped>
.completed-orders {
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f7f8fa;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
}

.no-orders {
  text-align: center;
  font-size: 1.2em;
  color: #888;
}

/* Grid van kaarten */
.order-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.order-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

h2 {
  margin: 0 0 12px;
  font-size: 1.5rem;
  color: #444;
}

/* Lijst van producten */
.order-items {
  list-style-type: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.order-item {
  padding: 8px;
  font-size: 1rem;
  border-bottom: 1px solid #eee;
  color: #555;
}

.order-item:last-child {
  border-bottom: none;
}

/* Knop om order terug te zetten */
.btn {
  font-size: 1rem;
  font-weight: bold;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: background 0.3s, transform 0.2s;
}

.pending-btn {
  background-color: #ff9800;
  color: #fff;
  margin-top: 10px;
  align-self: center;
}

.pending-btn:hover {
  background-color: #e68900;
  transform: scale(1.05);
}

/* Mooie notificatie */
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

/* Responsiviteit */
@media (max-width: 1024px) {
  .order-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .order-list {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
