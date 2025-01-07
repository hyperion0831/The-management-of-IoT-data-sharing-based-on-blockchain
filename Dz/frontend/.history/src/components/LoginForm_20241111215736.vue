<template>
  <div class="login-wrapper">
    <!-- 标题 -->
    <h1>欢迎使用智能手表健康监测系统</h1>

    <!-- 区块链用户名和密码显示区域 -->
    <div class="blockchain-info">
      <h2>区块链信息</h2>
      <label>区块链用户名：</label>
      <input type="text" v-model="displayPublicKey" readonly />
      <label>密码：</label>
      <input type="text" v-model="displayPrivateKey" readonly />
    </div>

    <!-- 登录、注册按钮 -->
    <div class="button-row">
      <button @click="handleLogin">登录</button>
      <button @click="toggleRegistration">注册</button>
    </div>

    <!-- 注册界面（覆盖页面） -->
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
        <label for="doctorId">工号：</label>
        <input type="text" v-model="doctorId" placeholder="请输入工号" />
      </div>
      <div v-else>
        <label for="name">姓名：</label>
        <input type="text" v-model="name" placeholder="请输入姓名" />
      </div>

      <button @click="generateAndSaveKeyPair">生成密钥对</button>
      <p v-if="keyGenerated">密钥对已生成并保存到文件中。</p>
      <button @click="cancelRegistration">取消</button>
    </div>
  </div>
</template>
