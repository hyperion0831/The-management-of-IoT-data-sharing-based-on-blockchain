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
      simulateInterval: null,  // 新增模拟定时器
    };
  },
  
  created() {
    this.loadPatients();
    this.checkIsDoctor();
    
    if (!this.isDoctor) {
      this.connectToSmartWatch(); // 用户登录时连接到智能手表
    }

    this.fetchData();
    this.startFetching();
    this.startSimulatingData();  // 启动数据模拟
  },
  beforeUnmount() {
    clearInterval(this.fetchInterval);
    clearInterval(this.simulateInterval);  // 清理模拟定时器
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

    generateRandomHeartRate() {
      return Math.floor(Math.random() * (100 - 60 + 1)) + 60;
    },

    startSimulatingData() {
      this.simulateInterval = setInterval(() => {
        const heartRate = this.generateRandomHeartRate();
        this.userHealthData.heartRate = heartRate;
        this.uploadDataToBlockchain(heartRate);  // 上传模拟数据
      }, 5000);
    },

    async connectToSmartWatch() {
      try {
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ services: ['heart_rate'] }],
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('heart_rate');
        const characteristic = await service.getCharacteristic('heart_rate_measurement');

        characteristic.addEventListener('characteristicvaluechanged', (event) => {
          const value = event.target.value;
          const heartRate = value.getUint8(1);
          this.userHealthData.heartRate = heartRate;
          console.log('实时心率数据:', heartRate);
          this.uploadDataToBlockchain(heartRate);  // 上传实时数据
        });

        await characteristic.startNotifications();
        console.log('已连接到智能手表，开始接收心率数据...');
      } catch (error) {
        console.error('连接智能手表失败:', error);
      }
    },

    async uploadDataToBlockchain(heartRate) {
      const userName = sessionStorage.getItem('userName').split('-')[1];
      const payload = {
        user: userName,
        healthData: { heartRate },
        timestamp: new Date().toISOString(),
      };

      try {
        const response = await fetch('/api/blockchain/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          console.log('数据成功上传到区块链');
        } else {
          console.error('上传失败:', await response.text());
        }
      } catch (error) {
        console.error('请求区块链 API 出错:', error);
      }
    },

    async fetchData() {
      try {
        if (this.isDoctor) {
          console.log('调用 API 获取病人数据');
        } else {
          console.log('调用 API 获取用户健康数据');
        }
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    },

    checkIsDoctor() {
      const userName = sessionStorage.getItem('userName');
      if (userName) {
        this.isDoctor = userName.split('-')[0] === 'doctor';
        console.log("是否为医生:", this.isDoctor);
      }
    },

    startFetching() {
      console.log('启动数据监测和上传');
      this.connectToSmartWatch();
      this.fetchInterval = setInterval(() => {
        this.uploadDataToBlockchain(this.userHealthData.heartRate);  // 上传当前数据
      }, 5 * 60 * 1000);
    }
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
