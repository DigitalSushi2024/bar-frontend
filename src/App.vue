<template>
  <div>
    <nav>
      <ul>
        <li><router-link to="/pending">Pending Orders</router-link></li>
        <li><router-link to="/done">Done Orders</router-link></li>
      </ul>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style src="./assets/styles.css"></style>
