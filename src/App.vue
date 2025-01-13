<template>
  <div>
    <nav>
      <ul>
        <li><router-link to="/pending">Open bestellingen</router-link></li>
        <li><router-link to="/done">Afgeronden bestellingen</router-link></li>
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
