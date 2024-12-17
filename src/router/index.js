import { createRouter, createWebHistory } from 'vue-router';
import PendingOrders from '../views/PendingOrders.vue';
import DoneOrders from '../views/DoneOrders.vue';

const routes = [
    { path: '/', redirect: '/pending' },
    { path: '/pending', name: 'PendingOrders', component: PendingOrders },
    { path: '/done', name: 'DoneOrders', component: DoneOrders },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
