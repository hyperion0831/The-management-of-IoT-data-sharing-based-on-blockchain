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
  },
  }
  </script>
  