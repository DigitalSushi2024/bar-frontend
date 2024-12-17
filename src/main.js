import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importeer de router

createApp(App)
    .use(router) // Gebruik de router
    .mount('#app');
