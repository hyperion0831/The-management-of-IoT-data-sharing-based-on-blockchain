<template>
  <div>
    <h1>实时数据监测</h1>
    <div v-if="isDoctor">
      <h2>病人列表</h2>
      <ul v-if="patients && patients.length">
        <li v-for="patient in patients" :key="patient.id">
          {{ patient.name }} - {{ patient.healthData }}
        </li>
      </ul>
      <p v-else>没有找到病人数据。</p>
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
      isDoctor: false,
      patients: [],
      userHealthData: {
        heartRate: 0,
        bloodPressure: "120/80",
        sleepStatus: "良好",
      },
      fetchInterval: null,
    };
  },
  created() {

    this.loadPatientsFromLocalStorage();
    // 从 sessionStorage 中获取用户身份
    this.checkIsDoctor();
    // 根据身份获取相应数据
    this.fetchData();
    // 启动定时获取实时数据
    this.startFetching();
  },
  beforeUnmount() {
    clearInterval(this.fetchInterval);
  },
  methods: {
    loadPatientsFromLocalStorage() {
      // 遍历 localStorage 中的所有键
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // 检查键是否以 'user-' 开头
        if (key.startsWith('user-')) {
          const patientData = JSON.parse(localStorage.getItem(key));
          
          // 将病人数据加入 patientList
          this.patientList.push({
            name: key.split('-')[1],  // 从键中提取病人名字
            data: patientData         // 存储病人的具体信息
          });
        }
      }
    },
    async fetchData() {
      try {
        if (this.isDoctor) {
          // 调用 API 获取病人数据
          console.log('调用 API 获取病人数据');
          //const response = await fetch('/api/patients'); // 假设 API 返回病人数据
          //this.patients = await response.json();
        } else {
          
          console.log('调用 API 获取用户自己的健康数据');
          // 调用 API 获取用户自己的健康数据
          //const userName = sessionStorage.getItem('userName').split('-')[1];
          //const response = await fetch(`/api/users/${userName}/healthData`);
          //this.userHealthData = await response.json();
        }
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    },
    checkIsDoctor() {
      // 从 sessionStorage 获取 userName 并检查第一部分是否为 'doctor'
      const userName = sessionStorage.getItem('userName');
      if (userName) {
        this.isDoctor = userName.split('-')[0] === 'doctor';
        console.log("是否为医生:", this.isDoctor); // 输出结果
      }
    },
    startFetching() {
      console.log('每隔5分钟获取一次数据');
      // 每隔5分钟获取一次数据
      /*
      this.fetchInterval = setInterval(() => {
        this.fetchData();
      }, 5 * 60 * 1000); // 5分钟
      */
    },
  },
};
</script>
