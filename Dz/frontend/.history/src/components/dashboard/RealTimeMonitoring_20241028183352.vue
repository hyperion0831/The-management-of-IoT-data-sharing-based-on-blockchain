<template>
    <div class="real-time-monitoring">
      <h2>实时数据监测</h2>
      <p>心率：{{ heartRate }} bpm</p>
      <p>血压：{{ bloodPressure }} mmHg</p>
      <p>睡眠状态：{{ sleepStatus }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        heartRate: 0,
        bloodPressure: "120/80",
        sleepStatus: "良好"
      };
    },
    mounted() {
      // 定时获取实时数据
    }
  }
  </script>
  