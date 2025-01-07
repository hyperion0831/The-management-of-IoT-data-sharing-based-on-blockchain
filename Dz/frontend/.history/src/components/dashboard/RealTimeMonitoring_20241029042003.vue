<template>
    <div>
      <h1>实时数据监测</h1>
      <div v-if="isDoctor">
        <h2>病人列表</h2>
        <ul>
          <li v-for="patient in patients" :key="patient.id">
            {{ patient.name }} - {{ patient.healthData }}
          </li>
        </ul>
      </div>
      <div v-else>
        <h2>我的健康数据</h2><p>心率：{{ heartRate }} bpm</p>
      <p>血压：{{ bloodPressure }} mmHg</p>
      <p>睡眠状态：{{ sleepStatus }}</p>
    </div>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        heartRate: 0,
        bloodPressure: "120/80",
        sleepStatus: "良好",
        isDoctor: false,
      patients: [],
      userHealthData: {},
      };
    },
    mounted() {
      // 定时获取实时数据
    },
    created() {
    // 从 sessionStorage 中获取用户身份
    this.isDoctor = sessionStorage.getItem('userRole') === 'doctor';
    // 根据身份获取相应数据
    this.fetchData();
  }, methods: {
    async fetchData() {
      if (this.isDoctor) {
        // 调用 API 获取病人数据
        const response = await fetch('/api/patients'); // 假设 API 返回病人数据
        this.patients = await response.json();
      } else {
        // 调用 API 获取用户自己的健康数据
        const userId = sessionStorage.getItem('userId');
        const response = await fetch(`/api/users/${userId}/healthData`);
        this.userHealthData = await response.json();
      }
    },
  },
  }
  </script>
  