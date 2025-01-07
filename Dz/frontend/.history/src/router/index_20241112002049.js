import { createRouter, createWebHistory } from 'vue-router';
import DataDashBoard from '../components/DataDashBoard.vue'; // 导入仪表盘组件
import Login from '../components/LoginForm.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/datadashboard', name: 'DataDashBoard', component: DataDashBoard },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
