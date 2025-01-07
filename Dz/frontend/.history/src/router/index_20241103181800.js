import { createRouter, createWebHistory } from 'vue-router';
import DataDashBoard from '../components/DataDashBoard.vue'; // 导入仪表盘组件

const routes = [
  {
    path: '/',
    name: 'DataDashBoard',
    component: DataDashBoard
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
