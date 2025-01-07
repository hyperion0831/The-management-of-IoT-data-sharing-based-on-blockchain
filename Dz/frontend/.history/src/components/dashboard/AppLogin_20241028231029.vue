<template>
  <div class="login">
    <h1>欢迎登录 / 注册</h1>

    <!-- 区块链用户名和密码显示区域 -->
    <div class="blockchain-info">
      <label>区块链用户名：</label>
      <input type="text" v-model="displayPublicKey" readonly style="display: inline; width: auto;" />
      <label>密码：</label>
      <input type="text" v-model="displayPrivateKey" readonly style="display: inline; width: auto;" />
    </div>
    <!-- 新增：身份和姓名显示区域 -->
    <div v-if="isLoggedIn" class="user-info">
      <span>身份：{{ identity === 'doctor' ? '医生' : '普通用户' }}</span>
      <span>姓名：{{ name }}</span>
    </div>
    <!-- 添加登录和注册和退出登录按钮 -->
    <button @click="toggleView('register')">注册</button>
    <button @click="toggleView('login')">登录</button>
    <button @click="logout">退出登录</button>
    <button @click="clearRegistration">注销账号</button>
    <!-- 条件渲染组件 -->
    <div v-if="currentView === 'register' && !isLoggedIn">
      <!-- 注册部分 -->
      <h2>注册</h2>
      <!-- 身份选择 -->
      <label for="identity">选择身份：</label>
      <select v-model="identity">
        <option value="doctor">医生</option>
        <option value="user">普通用户</option>
      </select>
      <!-- 身份信息输入 -->
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

      <!-- 生成密钥对按钮 -->
      <button @click="generateAndSaveKeyPair">生成密钥对</button>
      <p v-if="keyGenerated">密钥对已生成并保存到文件中。</p>
    </div>
    <div v-else-if="currentView === 'login' && !isLoggedIn">
      <!-- 登录部分 -->
        <input type="file" @change="handleFileUpload" />
    </div>
  </div>

</template>

<script>

export default {
  data() {
    return {
      currentView: null, // 初始无显示
      blockchainUsername: '',  // 区块链用户名
      blockchainPassword: '',  // 区块链密码
      uploadedFile: null,      // 已上传的文件
      displayPrivateKey: '',
      displayPublicKey: '',
      registeredUsers：[], // 存储已注册的用户信息
      selectedIdentity: 'user', // 当前选择的身份
      keyGenerated: false,
      isLoggedIn: false,
      privateKey: null,
      publicKey: null,
      identity: 'user',
      name: '',
      doctorId: '',
      errorMessage: '',// 错误消息
      showErrorModal: false,
    };
  },
  mounted() {
    // 页面加载时检查是否已登录
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const userName = sessionStorage.getItem("userName"); // 从 sessionStorage 获取用户名称
    if (isLoggedIn === "true" && userName) {
      this.isLoggedIn = true;
      this.name = userName; 

    // 检查注册信息是否存在
    const registrationKey = `${this.identity}-${this.name}-${this.doctorId || ''}`;
    const registeredData = localStorage.getItem(registrationKey);
    if (registeredData) {
        const parsedData = JSON.parse(registeredData);
        this.displayPublicKey = parsedData.publicKey;
        this.displayPrivateKey = parsedData.privateKey;
        this.keyGenerated = true;
    }
    }
    // 加载已注册的身份
    this.loadRegisteredUsers();
  },
  methods: {
    loadRegisteredUsers() {
      // 从 localStorage 中获取所有注册的用户信息
      for (let key in localStorage) {
        if (key.startsWith('user-') || key.startsWith('doctor-')) {
          const userInfo = JSON.parse(localStorage.getItem(key));
          this.registeredUsers.push(userInfo);
        }
      }
    },
    // 新增视图切换方法
    toggleView(view) {
      this.currentView = view;
    },
    // 检查是否已注册
    isRegistered() {
      const registered = localStorage.getItem(`${this.identity}-${this.name}-${this.doctorId|| ''}`);
      return !!registered;
    },
    // 注册
    async generateAndSaveKeyPair() {
      
      // 拼接出与注册时相同的键
      const registrationKey = `${this.identity}-${this.name}-${this.doctorId || ''}`;
      if (this.isRegistered()) {
        alert("已注册，请直接登录。");
        return;
      }
      if (this.identity === 'doctor') {
        if (this.name !== 'Dz' || this.doctorId !== '2448') {
          alert('医生身份信息错误，请检查姓名和工号。');
          return;
        }
      } else if (this.identity === 'user') {
        const validUserNames = ['TYC', 'DDS'];
        if (!validUserNames.includes(this.name)) {
          alert('普通用户姓名错误，请检查姓名。');
          return;
        }
      }
      try {
          // 创建种子字符串，确保不同身份和用户生成不同的密钥
          const uniqueSeed = `${this.identity}-${this.name}-${this.doctorId || ''}`;
          console.log(`生成密钥的种子信息：${uniqueSeed}`);

          // 生成密钥对
          const keyPair = await window.crypto.subtle.generateKey(
            {
              name: "RSA-OAEP",
              modulusLength: 2048,
              publicExponent: new Uint8Array([1, 0, 1]),
              hash: { name: "SHA-256" },
            },
            true,
            ["encrypt", "decrypt"]
          );
          const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
          const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

          const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
          const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)));

          const combinedKeys = `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64}\n-----END PUBLIC KEY-----\n-----BEGIN PRIVATE KEY-----\n${privateKeyBase64}\n-----END PRIVATE KEY-----`;
          
          // 将密钥对保存到文件
          const blob = new Blob([combinedKeys], { type: "application/octet-stream" });
          const downloadLink = document.createElement("a");
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = `${this.name}_password.txt`;
          downloadLink.click();
              
          // 将身份标记为已注册
          localStorage.setItem(registrationKey, JSON.stringify({ publicKey: publicKeyBase64, privateKey: privateKeyBase64 }));
          this.keyGenerated = true;
          this.$emit('registerSuccess', { identity: this.identity, name: this.name });

          console.log("密钥对文件已成功保存。");
          this.keyGenerated = true;
        } catch (error) {
            console.error("生成密钥对失败：", error);
            this.errorMessage = "生成密钥失败，请重试";
        }
    },
    //登录验证
    async verifyKeyPair(fileContent) {
        try {
          // 匹配公钥和私钥
          const publicKeyMatch = fileContent.match(/-----BEGIN PUBLIC KEY-----\n([\s\S]+?)\n-----END PUBLIC KEY-----/);
          const privateKeyMatch = fileContent.match(/-----BEGIN PRIVATE KEY-----\n([\s\S]+?)\n-----END PRIVATE KEY-----/);

          if (!publicKeyMatch || !privateKeyMatch) {
            this.errorMessage = "密钥文件格式不正确";
            alert(this.errorMessage);
            return;
          }

          const publicKeyBase64 = publicKeyMatch[1];
          const privateKeyBase64 = privateKeyMatch[1];
          // 获取注册信息
          const registrationKey = `${this.identity}-${this.name}-${this.doctorId || ''}`;
          const registeredData = localStorage.getItem(registrationKey);
          if (!registeredData) {
            alert("未找到注册信息，请检查身份和姓名。");
            return;
          }
          const publicKeyBuffer = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0));
          const privateKeyBuffer = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0));
          const registeredInfo = JSON.parse(registeredData);
          const registeredName = this.name; // 从 sessionStorage 或其他地方获取当前姓名
          // 检查文件中的姓名是否与注册信息一致
          if (registeredInfo.name !== registeredName) {
              alert("上传的密钥文件中的姓名与注册信息不符。");
              return;
          }
          // 尝试导入公钥和私钥
          const publicKey = await window.crypto.subtle.importKey(
            "spki",
            publicKeyBuffer,
            { name: "RSA-OAEP", hash: "SHA-256" },
            true,
            ["encrypt"]
          );
          const privateKey = await window.crypto.subtle.importKey(
            "pkcs8",
            privateKeyBuffer,
            { name: "RSA-OAEP", hash: "SHA-256" },
            true,
            ["decrypt"]
          );

          // 额外的加密和解密步骤进行验证
          const testMessage = new TextEncoder().encode("Test message");
          const encryptedMessage = await window.crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            publicKey,
            testMessage
          );
          
          // 尝试解密消息
          await window.crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            privateKey,
            encryptedMessage
          );

          // 解密成功，密钥匹配，设置登录状态
          this.isLoggedIn = true;
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("userName", this.name);
          console.log(`身份: ${this.identity}, 姓名: ${this.name}, 医生 ID: ${this.doctorId}`);

          alert(`登录成功！欢迎你，${this.identity === 'doctor' ? '医生' : '用户'}${this.name}！`);

        } catch (error) {
          this.errorMessage = error.message.includes("decrypt") 
            ? "密钥不匹配，请上传正确的密钥文件。" 
            : "密钥错误，请重新上传。";
          alert(this.errorMessage);
        } 
    }, 

    //秘钥显示
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const fileContent = reader.result;
          this.verifyKeyPair(fileContent);  // 处理文件内容
          // 提取公钥和私钥内容并显示
          const publicKeyMatch = fileContent.match(/-----BEGIN PUBLIC KEY-----\n([\s\S]+?)\n-----END PUBLIC KEY-----/);
          const privateKeyMatch = fileContent.match(/-----BEGIN PRIVATE KEY-----\n([\s\S]+?)\n-----END PRIVATE KEY-----/);

          if (publicKeyMatch && privateKeyMatch) {
            this.displayPublicKey = publicKeyMatch[1];
            this.displayPrivateKey = privateKeyMatch[1];
          } else {
            alert("文件格式不正确，请上传包含公钥和私钥的文件。");
          }
        };

        reader.readAsText(file);
      }
    },

    // 清除已注册的身份信息
    clearRegistration() {
        // 检查用户是否已登录
      if (!this.isLoggedIn) {
        alert("请先登录再尝试注销账号。");
        return;
      }
      const registrationKey = `${this.identity}-${this.name}-${this.doctorId || ''}`;
      console.log("尝试清除的注册信息键：", registrationKey);

      if (localStorage.getItem(registrationKey)) {
          // 删除该键
          localStorage.removeItem(registrationKey);
          sessionStorage.removeItem("isLoggedIn"); // 移除登录状态
          sessionStorage.removeItem("userName"); // 移除用户名
          
          this.isLoggedIn = false;
          this.keyGenerated = false;
          this.identity = '';
          this.name = '';
          this.doctorId = '';

          alert("已成功清除注册信息。");

      } else {
          alert("未找到对应的注册信息。");
      }
    },

    //退出登录
    logout() {
      // 退出登录时清除 sessionStorage 中的登录状态
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("userName");
      // 清除数据
      this.isLoggedIn = false;
      this.name = '';
      this.displayPublicKey = '';
      this.displayPrivateKey = '';
      this.uploadedFile = null;
      this.isLoggedIn = false;
      this.name = '';
      alert("已退出登录");
      this.$router.push({ name: 'DataDashBoard' });
    },
  },
};
</script>

<style scoped>
.blockchain-info {
  display: flex;
  flex-direction: column; /* 纵向排列 */
  align-items: center;    /* 子元素水平居中，可根据需要调整 */
}
.login {
  max-width: 300px;
  margin: auto;
}
button {
  margin-top: 10px;
}
select, input {
  margin-top: 5px;
  display: block;
}
/* 样式控制行内布局 */
.key-display {
  margin-top: 20px;
}
.key-field {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.key-field label {
  margin-right: 5px;
  width: 100px; /* 控制标签宽度 */
}
.key-field input {
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.modal {
  display: block;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-content {
  position: relative;
  margin: 15% auto;
  padding: 20px;
  background-color: #fff;
  width: 80%;
  max-width: 400px;
  text-align: center;
  border-radius: 5px;
}
.close {
  position: absolute;
  top: 10px;
  right: 15px;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
}
.close:hover {
  color: #000;
}
</style>
