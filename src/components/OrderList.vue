<template>
  <div class="order-list">
    <div v-for="order in orders" :key="order.orderId" class="order-item">
      <h2>Order #{{ order.orderId }}</h2>
      <ul>
        <li v-for="item in order.orderItems" :key="item.productId">
          {{ item.quantity }} x {{ item.productName }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderList',
  props: {
    orders: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.order-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.order-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 5px;
  width: 200px;
}
</style>
