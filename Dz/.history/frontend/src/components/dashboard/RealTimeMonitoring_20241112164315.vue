<template>
  <div class="real-time-monitoring">
    <h1>实时数据监测</h1>
    <div v-if="isDoctor" class="doctor-section">
      <div class="patient-select">
        <label>查看病人</label>
        <select v-model="loadPatients">
          <option v-for="patient in patients" :key="patient.id" :value="patient">
            {{ patient.name }} 
          </option>
        </select>
      </div>
      <div class="refresh-rate">
        <label>刷新频率：</label>
        <select v-model="refreshRate">
          <option value="5">5秒</option>
          <option value="10">10秒</option>
          <option value="30">30秒</option>
        </select>
      </div>
    </div>
    <div v-else class="user-section">
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
import Chart from 'chart.js/auto';
import api from '../services/api.js';

export default {
  data() {
    return {
      isDoctor: false,
      patients: [],
      userHealthData: {
        heartRate: 0,
        bloodPressure: "120/80",
        sleepStatus: "良好",
      },
      fetchInterval: null,
      uploadInterval: null,
      refreshRate: 5, // 默认刷新频率为 5 秒
      //可视化
      heartRateChart: null,
      heartRateData: [],
      heartRateLabels: [],
    };
  },

  created() {
    this.loadPatients();
    this.checkIsDoctor();
    this.fetchData();
    this.startFetching();
    this.startUploading(); // 启动自动上传心率数据
  },
  
  beforeUnmount() {
    clearInterval(this.fetchInterval);
    clearInterval(this.uploadInterval);
  },
  
  mounted() {
    this.initHeartRateChart();
  },

  methods: {
    loadPatients() {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('user-')) {
          this.patients.push({
            name: key.split('-')[1],
          });
        }
      }
    },

    // 定时生成心率数据
    generateHeartRate() {
      // 模拟心率数据（60-100 bpm 范围）
      const randomHeartRate = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
      this.userHealthData.heartRate = randomHeartRate;
    },

    // 自动上传心率数据
    async uploadHeartRate() {
      this.generateHeartRate();
      try {
        const userName = sessionStorage.getItem('userName').split('-')[1];
        const response = await fetch('/api/uploadHeartRate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: userName,
            heartRate: this.userHealthData.heartRate,
            timestamp: new Date().toISOString(),
          }),
        });
        if (response.ok) {
          console.log("数据上传成功");
        } else {
          console.error("数据上传失败");
        }
      } catch (error) {
        console.error("上传数据时出错:", error);
      }
    },

    // 定时获取最新数据并更新图表
    startFetching() {
      this.fetchInterval = setInterval(() => {
        this.fetchData();
      }, this.refreshRate * 1000);
    },

    // 定时上传数据
    startUploading() {
      this.uploadInterval = setInterval(() => {
        this.uploadHeartRate();
      }, this.refreshRate * 1000);
    },

    async fetchData() {
      try {
        if (this.isDoctor) {
          console.log('调用 API 获取病人数据');
        } else {
          console.log('调用 API 获取用户自己的健康数据');
        }
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    },
    
    checkIsDoctor() {
      const userName = sessionStorage.getItem('userName');
      if (userName) {
        this.isDoctor = userName.split('-')[0] === 'doctor';
      }
    },
    //可视化
    initHeartRateChart() {
      const ctx = document.getElementById('heartRateChart').getContext('2d');
      this.heartRateChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.heartRateLabels,
          datasets: [{
            label: '心率 (bpm)',
            data: this.heartRateData,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
          }],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'second',
              },
            },
            y: {
              min: 40,
              max: 120,
            },
          },
        },
      });
    },

    updateChartData(heartRate, timestamp) {
      this.heartRateData.push(heartRate);
      this.heartRateLabels.push(timestamp);
      if (this.heartRateData.length > 20) {
        this.heartRateData.shift();
        this.heartRateLabels.shift();
      }
      this.heartRateChart.update();
    },
  },
};
</script>

<style scoped>

h1 {
  font-size: 26px;
  align-self: flex-start; /* 将标题移到左边 */
  border-bottom: 2px solid #888c92; /* 添加下划线 */
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 5px;
}

.doctor-section, .user-section {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 20px;
  color: #555;
  margin-bottom: 15px;
}

.patient-select, .refresh-rate {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
}

label {
  font-size: 16px;
  color: #666;
}

select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 60%;
}

.user-health-data p {
  font-size: 16px;
  color: #444;
  margin-top: 10px;
}
</style>
