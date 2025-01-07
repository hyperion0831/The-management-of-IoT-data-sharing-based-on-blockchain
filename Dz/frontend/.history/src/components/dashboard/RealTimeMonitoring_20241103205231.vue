<template>
  <div class="settings">
    <h1>设置</h1>
    <div class="blockchain-info">
      <label>区块链用户名：</label>
      <input type="text" v-model="displayPublicKey" readonly />
      <label>密码：</label>
      <input type="text" v-model="displayPrivateKey" readonly />
    </div>
    <div v-if="isLoggedIn" class="user-info">
      <span>身份：{{ identity === 'doctor' ? '医生' : '普通用户' }}</span>
      <span>姓名：{{ name }}</span>
    </div>
    <div class="buttons">
      <button @click="toggleView('register')">注册</button>
      <button @click="toggleView('login')">登录</button>
      <button @click="logout">退出登录</button>
      <button @click="clearRegistration">注销账号</button>
    </div>
    <div v-if="currentView === 'register' && !isLoggedIn">
      <h2>注册</h2>
      <label>选择身份：</label>
      <select v-model="identity">
        <option value="doctor">医生</option>
        <option value="user">普通用户</option>
      </select>
      <div v-if="identity === 'doctor'">
        <label>姓名：</label>
        <input type="text" v-model="name" placeholder="请输入姓名" />
        <label>工号：</label>
        <input type="text" v-model="doctorId" placeholder="请输入工号" />
      </div>
      <div v-else>
        <label>姓名：</label>
        <input type="text" v-model="name" placeholder="请输入姓名" />
      </div>
      <button @click="generateAndSaveKeyPair">生成密钥对</button>
      <p v-if="keyGenerated">密钥对已生成并保存到文件中。</p>
    </div>
    <div v-else-if="currentView === 'login' && !isLoggedIn">
      <input type="file" @change="handleFileUpload" />
    </div>
  </div>
</template>

<style scoped>
.settings {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 26px;
  color: #333;
  margin-bottom: 20px;
}

.blockchain-info, .user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.blockchain-info label, .user-info span, .register label, .register select, .register input {
  margin-bottom: 10px;
}

input[type="text"], select {
  padding: 8px;
  width: 100%;
  max-width: 280px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.buttons button {
  margin: 5px;
  padding: 10px 15px;
  background-color: #888c92;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.buttons button:hover {
  background-color: #acababcc;
}

h2 {
  font-size: 20px;
  color: #555;
  margin-top: 20px;
}
</style>

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
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  font-size: 20px;
  color: #555;
  margin-bottom: 15px;
}

.doctor-section, .user-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

label {
  font-size: 16px;
  color: #666;
  margin-right: 10px;
}

select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  color: #444;
  margin-top: 10px;
}

/* 特定样式，控制布局 */
.refresh-rate, .patient-select {
  display: flex;
  align-items: center;
  margin-top: 15px;
  gap: 10px;
}

.patient-select label, .refresh-rate label {
  font-size: 16px;
  color: #333;
}

.user-health-data p {
  margin: 8px 0;
  font-size: 16px;
  color: #444;
}
</style>
