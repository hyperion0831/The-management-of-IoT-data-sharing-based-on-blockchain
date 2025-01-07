import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // 后端 API 地址
  headers: {
    'Content-Type': 'application/json',
  },
});

// 导出 API 方法
export default {
    // 获取健康数据的接口
    getHealthData() {
      return apiClient.get('/healthData');
    },
    // 上传心率数据的接口
    uploadHeartRate(data) {
      return apiClient.post('/uploadHeartRate', data);
    },
};
