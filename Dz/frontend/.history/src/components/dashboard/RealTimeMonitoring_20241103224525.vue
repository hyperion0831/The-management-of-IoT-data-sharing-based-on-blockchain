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
      <div class="user-health-data">
        <p>心率：{{ userHealthData.heartRate }} bpm</p>
        <p>血压：{{ userHealthData.bloodPressure }} mmHg</p>
        <p>睡眠状态：{{ userHealthData.sleepStatus }}</p>
      </div>
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

    this.loadPatients();
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
    loadPatients() {
      // 遍历 localStorage 中的所有键
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // 检查键是否以 'user-' 开头
        if (key.startsWith('user-')) {
          this.patients.push({
            name: key.split('-')[1],  // 从键中提取病人名字
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
