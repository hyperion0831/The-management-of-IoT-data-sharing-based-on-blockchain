import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // 后端 API 地址
  headers: {
    'Content-Type': 'application/json',
  },
});

// 导出 API 方法
export default {
  getHealthData() {
    return apiClient.get('/healthData'); // 调用后端的一个示例接口
  },
};
