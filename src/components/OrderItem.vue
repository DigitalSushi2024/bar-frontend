<template>
  <div class="order-item">
    <h2>Order #{{ order.orderId }}</h2>
    <ul>
      <li
          v-for="item in order.orderItems"
          :key="item.productId"
          @click="toggleItemStatus(item)"
          :class="{ completed: item.status === 'Complete' }"
      >
        <span>
          {{ item.quantity }} x {{ item.productName }}
        </span>
      </li>
    </ul>
    <button
        v-if="isOrderCompleted"
        @click="markAsCompleted"
        class="complete-button"
    >
      Mark Order as Done
    </button>
  </div>
</template>

<script>
import apiService from "../services/apiServices";

export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isOrderCompleted: false,
    };
  },
  methods: {
    async toggleItemStatus(item) {
      console.log("Clicked item:", item); // Controleer of productId bestaat
      try {
        const newStatus = item.status === "Complete" ? "Pending" : "Complete";
        if (!item.productId) {
          console.error("productId is undefined! Check backend response.");
          return;
        }
        await apiService.updateOrderItemStatus(item.productId, newStatus);
        item.status = newStatus;
        this.checkOrderCompletion();
      } catch (error) {
        console.error("Error updating item status:", error);
      }
    },
    checkOrderCompletion() {
      // Controleer of alle items 'Complete' zijn
      this.isOrderCompleted = this.order.orderItems.every(
          (item) => item.status === "Complete"
      );
    },
    markAsCompleted() {
      // Emit event naar parent component om de order-status op 'done' te zetten
      this.$emit("order-completed", this.order.orderId);
    },
  },
  mounted() {
    this.checkOrderCompletion(); // Check bij het laden van de component
  },
};
</script>

<style scoped>
.order-item {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: 250px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
h2 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #333;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 8px 0;
  cursor: pointer;
  transition: color 0.2s, text-decoration 0.2s;
}
li.completed {
  text-decoration: line-through;
  color: #28a745;
}
.complete-button {
  background-color: #28a745;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
  width: 100%;
  text-align: center;
}
.complete-button:hover {
  background-color: #218838;
}
</style>
