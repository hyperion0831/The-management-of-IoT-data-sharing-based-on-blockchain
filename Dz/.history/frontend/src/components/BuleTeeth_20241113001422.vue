<template>
  <div class="real-time-monitoring">
    <h1>实时数据监测</h1>
    
    <!-- 医生界面 -->
    <div v-if="isDoctor" class="doctor-section">
      <div class="patient-select">
        <label>查看病人</label>
        <select v-model="selectedPatient" @change="onPatientChange">
          <option v-for="patient in patients" :key="patient.id" :value="patient.name">
            {{ patient.name }}
          </option>
        </select>
      </div>

      <!-- 心率图表 -->
      <div v-if="selectedPatientData">
        <h2>{{ selectedPatient }} 的健康数据</h2>
        <canvas id="patientHeartRateChart"></canvas>
      </div>
    </div>

    <!-- 用户界面 -->
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
import { nextTick } from 'vue';
import Chart from 'chart.js/auto';
import api from '../services/api.js';

export default {
  data() {
    return {
      isDoctor: false,
      patients: [],
      selectedPatient: '', // 选中的病人
      selectedPatientData: null, // 选中病人的健康数据
      patientHeartRateChart: null, // 选中病人的图表实例

      // 用户健康数据
      userHealthData: {
        heartRate: 0,
        bloodPressure: '120/80',
        sleepStatus: '良好',
      },
    };
  },

  mounted() {
    this.checkIsDoctor();
    if (!this.isDoctor) {
      this.initUserHeartRateChart(); // 初始化用户心率图表
      this.loadUserHealthData(); // 加载并更新用户的健康数据
    }
  },

  methods: {
    checkIsDoctor() {
      const userName = sessionStorage.getItem('userName');
      this.isDoctor = userName?.split('-')[0] === 'doctor';
      if (this.isDoctor) {
        this.loadPatients();
      }
    },

    // 加载病人列表
    loadPatients() {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('user-')) {
          this.patients.push({
            id: i,
            name: key.split('-')[1],
          });
        }
      }
    },

    // 选择病人时触发
    async onPatientChange() {
      if (this.selectedPatient) {
        // 调用 API 获取选中病人的健康数据
        const response = await api.getUserHealthData(this.selectedPatient);
        this.selectedPatientData = response.data;

        // 更新图表
        nextTick(() => {
          this.initPatientHeartRateChart();
        });
      }
    },

    // 初始化选中病人的图表
    initPatientHeartRateChart() {
      const canvas = document.getElementById('patientHeartRateChart');
      if (this.patientHeartRateChart) {
        this.patientHeartRateChart.destroy();
      }

      this.patientHeartRateChart = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
          labels: this.selectedPatientData.timestamps,
          datasets: [{
            label: `${this.selectedPatient} 心率 (bpm)`,
            data: this.selectedPatientData.heartRates,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
          }],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'minute',
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

    // 初始化用户自己的图表（普通用户）
    initUserHeartRateChart() {
      const ctx = document.getElementById('heartRateChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: [], // 初始化为空
          datasets: [{
            label: '心率 (bpm)',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
          }],
        },
      });
    },
  },
};
</script>
