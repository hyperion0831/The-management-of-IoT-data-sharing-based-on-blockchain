<template>
  <div class="real-time-monitoring">
    <h1>实时数据监测</h1>

    <!-- 用户界面 -->
    <div class="user-section">
      <h2>我的健康数据</h2>
      <canvas id="heartRateChart"></canvas>
      <div class="user-health-data">
        <p>心率：{{ userHealthData.heartRate }} bpm</p>
        <p>血压：{{ userHealthData.bloodPressure }} mmHg</p>
        <p>睡眠状态：{{ userHealthData.sleepStatus }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick } from 'vue';
import Chart from 'chart.js/auto';
//import api from '../services/api.js';

export default {
  data() {
    return {
      userHealthData: {
        heartRate: 0,
        bloodPressure: '120/80',
        sleepStatus: '良好',
      },
      userHeartRateChart: null, // 用户心率图表实例
    };
  },

  mounted() {
    this.initUserHeartRateChart(); // 初始化用户心率图表
    this.loadUserHealthData(); // 加载并更新用户的健康数据
  },

  methods: {
    // 初始化用户自己的图表
    initUserHeartRateChart() {
      const canvas = document.getElementById('heartRateChart');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        this.userHeartRateChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: [], // 时间戳
            datasets: [
              {
                label: '心率 (bpm)',
                data: [], // 初始化为空
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
              },
            ],
          },
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: '时间',
                },
              },
              y: {
                title: {
                  display: true,
                  text: '心率 (bpm)',
                },
                min: 40,
                max: 120,
              },
            },
          },
        });
      }
    },

    loadUserHealthData() {
      const userData = JSON.parse(localStorage.getItem('userHealthData') || '{}');
      const timestamps = userData.timestamps || [];
      const heartRates = userData.heartRates || [];

      if (this.userHeartRateChart) {
        this.userHeartRateChart.data.labels = timestamps;
        this.userHeartRateChart.data.datasets[0].data = heartRates;
        nextTick(() => {
          this.userHeartRateChart.update();
        }) 
      }

      // 更新用户健康数据
      this.userHealthData.heartRate = userData.heartRate || 0;
      this.userHealthData.bloodPressure = userData.bloodPressure || '120/80';
      this.userHealthData.sleepStatus = userData.sleepStatus || '良好';
    },
  },
};
</script>