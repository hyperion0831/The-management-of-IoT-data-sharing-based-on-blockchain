import { createRouter, createWebHistory } from 'vue-router';
import DataDashBoard from '../components/DataDashBoard.vue'; // 导入仪表盘组件
import AppLogin from '../components/dashboard/AppLogin.vue'; // 导入登录组件
import DataUpload from '@/components/dashboard/DataUpload.vue'

const routes = [
  {
    path: '/',
    name: 'DataDashBoard',
    component: DataDashBoard
  },
  {
    path: '/login',
    name: 'AppLogin',
    component: AppLogin // 添加登录页面路由
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
