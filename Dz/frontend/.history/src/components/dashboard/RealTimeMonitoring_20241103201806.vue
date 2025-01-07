<template>
  <div>
    <h1>实时数据监测</h1>
    <div v-if="isDoctor">
      <h2>病人列表</h2>
      <ul v-if="patients && patients.length">
        <label>查看病人</label>
        <select v-model="selectedPatient">
          <option v-for="patient in patients" :key="patient.name" :value="patient">
            {{ patient.name }}
          </option>
        </select>
      </ul>
      <p v-else>没有找到病人数据。</p>
      <label>刷新频率：</label>
      <select v-model="refreshRate">
        <option value="5000">5秒</option>
        <option value="10000">10秒</option>
        <option value="30000">30秒</option>
      </select>
    </div>
    <div v-else>
      <h2>我的健康数据</h2>
      <p>心率：{{ userHealthData.heartRate }} bpm</p>
      <p>血压：{{ userHealthData.bloodPressure }} mmHg</p>
      <p>睡眠状态：{{ userHealthData.sleepStatus }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedPatient: null,  // 用于存储选中的病人
      patients: [],
      userHealthData: {
        heartRate: 0,
        bloodPressure: "120/80",
        sleepStatus: "良好",
      },
      refreshRate: 5000,  // 默认刷新频率
      fetchInterval: null,
    };
  },
  computed: {
    isDoctor() {
      const userName = sessionStorage.getItem('userName');
      return userName && userName.split('-')[0] === 'doctor';
    },
  },
  watch: {
    // 监听刷新频率的变化
    refreshRate(newRate) {
      clearInterval(this.fetchInterval);
      this.startFetching();
    },
  },
  created() {
    this.loadPatients();  // 加载病人数据
    this.fetchData();     // 初次获取数据
    this.startFetching(); // 开启定时器
  },
  beforeUnmount() {
    clearInterval(this.fetchInterval);
  },
  methods: {
    loadPatients() {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('user-')) {
          this.patients.push({ name: key.split('-')[1] });
        }
      }
    },
    async fetchData() {
      try {
        if (this.isDoctor) {
          console.log("获取医生的病人数据");
          // 示例 API 调用代码
          // const response = await fetch("/api/patients");
          // this.patients = await response.json();
        } else {
          console.log("获取用户的健康数据");
          // const userName = sessionStorage.getItem("userName").split("-")[1];
          // const response = await fetch(`/api/users/${userName}/healthData`);
          // this.userHealthData = await response.json();
        }
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    },
    startFetching() {
      this.fetchInterval = setInterval(() => {
        this.fetchData();
      }, this.refreshRate);
    },
  },
};
</script>
