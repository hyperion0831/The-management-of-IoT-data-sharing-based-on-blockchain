<template>
  <div class="login-container">
    <!-- 初始页面显示部分 -->
    <div v-if="!isRegistering" class="initial-view">
      <h1>欢迎使用智能手表健康监测系统</h1>

      <!-- 区块链用户名和密码显示区域 -->
      <div class="blockchain-info">
        <label>区块链用户名：</label>
        <input type="text" v-model="displayPublicKey" readonly />
        <label>密码：</label>
        <input type="text" v-model="displayPrivateKey" readonly />
      </div>

      <!-- 登录和注册按钮 -->
      <div class="button-row">
        <button @click="toggleView('login')">登录</button>
        <button @click="toggleView('register')">注册</button>
      </div>
    </div>

    <!-- 注册页面（覆盖整个页面） -->
    <div v-if="isRegistering" class="register-overlay">
      <h2>注册</h2>
      <label for="identity">选择身份：</label>
      <select v-model="identity">
        <option value="doctor">医生</option>
        <option value="user">普通用户</option>
      </select>

      <div v-if="identity === 'doctor'">
        <label for="name">姓名：</label>
        <input type="text" v-model="name" placeholder="请输入姓名" />
        <label for="id">工号：</label>
        <input type="text" v-model="doctorId" placeholder="请输入工号" />
      </div>
      <div v-else>
        <label for="name">姓名：</label>
        <input type="text" v-model="name" placeholder="请输入姓名" />
      </div>

      <button @click="generateAndSaveKeyPair">生成密钥对</button>
      <p v-if="keyGenerated">密钥对已生成并保存到文件中。</p>
      <button @click="completeRegistration">完成注册并返回</button>
      <button @click="cancelRegistration">取消</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 状态管理
const isRegistering = ref(false);
const identity = ref('user');
const name = ref('');
const doctorId = ref('');
const displayPublicKey = ref('区块链公钥');
const displayPrivateKey = ref('区块链私钥');
const keyGenerated = ref(false);

// 切换视图
function toggleView(view) {
  if (view === 'register') {
    isRegistering.value = true;
  } else {
    isRegistering.value = false;
  }
}

// 生成并保存密钥对
function generateAndSaveKeyPair() {
  // 示例生成密钥对的逻辑，可以根据需求替换
  displayPublicKey.value = `${identity.value}-${name.value}`;
  displayPrivateKey.value = `private-key-${Math.random().toString(36).substring(2)}`;
  keyGenerated.value = true;
}

// 完成注册并返回登录页面
function completeRegistration() {
  alert('注册成功！请返回登录页面。');
  isRegistering.value = false;
}

// 取消注册
function cancelRegistration() {
  isRegistering.value = false;
}
</script>

<style scoped>

h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  align-self: flex-start; /* 将标题移到左边 */
  border-bottom: 2px solid #888c92; /* 添加下划线 */
  padding-bottom: 5px;
}

.blockchain-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.blockchain-info label {
  font-size: 14px;
  color: #333;
}

.blockchain-info input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 5px;
  text-align: center;
}

.user-info {
  display: flex;
  justify-content: space-around;
  font-size: 14px;
  color: #555;
  margin-top: 10px;
  width: 100%;
}

.button-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
  width: 100%;
}

.button-row button {
  flex: 1 1 calc(50% - 10px);
  padding: 10px;
  background-color: #e8edf3;  
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button-row button:hover {
  background-color: #acababcc;
}

.register-section, .login-section {
  margin-top: 20px;
}

select, input[type="text"], input[type="file"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 5px;
}

p {
  font-size: 14px;
  color: #333;
  margin-top: 10px;
}
</style>
