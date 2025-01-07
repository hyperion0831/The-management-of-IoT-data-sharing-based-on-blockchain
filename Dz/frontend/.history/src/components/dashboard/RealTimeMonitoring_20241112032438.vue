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
import Web3 from 'web3';
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
    // 从 sessionStorage 中获取用户身份this.checkIsDoctor();
    this.checkIsDoctor();
    if (!this.isDoctor) {
      this.connectToSmartWatch(); // 用户登录时连接到智能手表
    }
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

    //获取智能手表数据
    async connectToSmartWatch() {
      try {
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ services: ['heart_rate'] }],
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('heart_rate');
        const characteristic = await service.getCharacteristic(
          'heart_rate_measurement'
        );

        // 监听心率数据变化
        characteristic.addEventListener('characteristicvaluechanged', (event) => {
          const value = event.target.value;
          const heartRate = value.getUint8(1);
          this.userHealthData.heartRate = heartRate; // 更新用户心率
          console.log('实时心率数据:', heartRate);
          
          // 自动上传数据到区块链
          this.uploadToBlockchain({ heartRate });
        });

        await characteristic.startNotifications();
        console.log('已连接到智能手表，开始接收心率数据...');
      } catch (error) {
        console.error('连接智能手表失败:', error);
      }
    },

    //上传数据到区块链
    async uploadToBlockchain(data) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        
        // 智能合约地址和 ABI
        const contractAddress = '您的智能合约地址';
        const contractABI = [
          // 您的智能合约 ABI（JSON 格式）
        ];

        const contract = new web3.eth.Contract(contractABI, contractAddress);

        // 上传数据到区块链
        const transaction = await contract.methods
          .uploadHealthData(data.heartRate)
          .send({ from: account });
        
        console.log('数据上传成功，交易哈希:', transaction.transactionHash);
      } catch (error) {
        console.error('上传数据到区块链失败:', error);
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
      console.log('启动数据监测和上传');
      this.connectToSmartwatch();

      // 每隔5分钟自动上传数据
      this.fetchInterval = setInterval(() => {
        this.uploadDataToBlockchain();
      }, 5 * 60 * 1000); // 5分钟
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
