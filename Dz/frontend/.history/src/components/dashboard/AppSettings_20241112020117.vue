<template>
  <div class="login">
    <h1>设置</h1>

    <!-- 新增：身份和姓名显示区域，类似区块链用户名和密码的显示方式 -->
    <div v-if="isLoggedIn" class="user-info">
      <div class="user-info-item">
        <label>身份：</label>
        <input type="text" :value="identity === 'doctor' ? '医生' : '普通用户'" readonly />
      </div>
      <div class="user-info-item">
        <label>姓名：</label>
        <input type="text" :value="name" readonly />
      </div>
    </div>


    <!-- 登录、注册和退出登录按钮 -->
    <div class="button-row">
      <button @click="logout">退出登录</button>
      <button @click="clearRegistration">注销账号</button>
    </div>

    <!-- 条件渲染组件 -->
    <div v-if="currentView === 'register' && !isLoggedIn" class="register-section">
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
    </div>

    <div v-else-if="currentView === 'login' && !isLoggedIn" class="login-section">
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
    const userName = sessionStorage.getItem("userName"); 
    if (isLoggedIn === "true" && userName) {
      this.isLoggedIn = true;
      this.name = userName.split('-')[1]; // 提取用户名
      const storedData = JSON.parse(localStorage.getItem(userName)); // 从 localStorage 获取密钥对数据
      if (storedData) {
        this.displayPublicKey = storedData.publicKey;
        this.displayPrivateKey = storedData.privateKey;
      }
    }
  },
  methods: {
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
      
      const registrationKey = `${this.identity}-${this.name}-${this.doctorId || ''}`;
      if (this.isRegistered()) {
        alert("已注册，请直接登录。");
        return;
      }
      let isValid = true; // 添加一个标志来追踪身份验证状态
  
      if (this.identity === 'doctor') {
        if (this.name !== 'Dz' || this.doctorId !== '2448') {
          alert('医生身份信息错误，请检查姓名和工号。');
          isValid = false; // 设置标志为false
        }
      } else if (this.identity === 'user') {
        const validUserNames = ['TYC', 'DDS'];
        if (!validUserNames.includes(this.name)) {
          alert('普通用户姓名错误，请检查姓名。');
          isValid = false; // 设置标志为false
        }
      }
        // 如果身份验证未通过，直接返回
        if (!isValid) {
          return;
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

    //秘钥显示
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const fileContent = reader.result;
          // 提取公钥和私钥内容并显示
          const publicKeyMatch = fileContent.match(/-----BEGIN PUBLIC KEY-----\n([\s\S]+?)\n-----END PUBLIC KEY-----/);
          const privateKeyMatch = fileContent.match(/-----BEGIN PRIVATE KEY-----\n([\s\S]+?)\n-----END PRIVATE KEY-----/);
          if (publicKeyMatch && privateKeyMatch) {
            this.displayPublicKey = publicKeyMatch[1];
            this.displayPrivateKey = privateKeyMatch[1];
            this.verifyKeyPair(publicKeyMatch[1], privateKeyMatch[1]);  // 处理文件内容
          } else {
            alert("文件格式不正确，请上传包含公钥和私钥的文件。");
          }
        };
        reader.readAsText(file);
      }
    },

    //登录验证
    async verifyKeyPair(publicKeyBase64, privateKeyBase64) {
      let matchingKey = null;
      try {
        // 遍历 localStorage 查找匹配的公私钥
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);//user-TYC-
          const storedData = JSON.parse(localStorage.getItem(key));
          if (storedData.publicKey === publicKeyBase64 &&
            storedData.privateKey === privateKeyBase64) 
          {
            matchingKey = key;
            console.log(`键值：${matchingKey}`);
            break;
          }
        }
        if (matchingKey) {
          console.log(`找到匹配的 registrationKey：${matchingKey}`);
          // 执行登录逻辑，例如设置登录状态、保存 session 等
          this.isLoggedIn = true;
          
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("userName", matchingKey); 
          alert(`登录成功！\n欢迎你， ${matchingKey.split('-')[1]}${matchingKey.startsWith('doctor') ? '医生' : '用户'}`);
        } else {
          alert("未找到匹配的注册信息，请检查密钥文件。");  
        }
      } catch (error) {
        console.error("验证密钥对时出错：", error);
        alert("密钥验证失败，请重新上传正确的密钥文件。");
      }
    },


    // 清除已注册的身份信息
    clearRegistration() {
        // 检查用户是否已登录
      if (!this.isLoggedIn) {
        alert("请先登录再尝试注销账号。");
        return;
      }
      const matchingKey = sessionStorage.getItem("userName");
      console.log("尝试清除的注册信息键：", matchingKey);
      if (localStorage.getItem(matchingKey)) {
          // 删除该键
          localStorage.removeItem(matchingKey);
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
      if (!this.isLoggedIn) {
        alert("请先登录账号。");
        return;
      }
      // 退出登录时清除 sessionStorage 中的登录状态
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("userName");
      // 清除数据
      this.isLoggedIn = false;
      this.name = '';
      this.displayPublicKey = '';
      this.displayPrivateKey = '';
      this.uploadedFile = null;
      this.name = '';
      alert("已退出登录");
      this.$router.push({ name: 'DataDashBoard' });
    },
  },
};
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

.user-info {
  display: flex;
  flex-direction: column; /* 上下排列 */
  align-items: center; /* 水平居中 */
  gap: 20px; /* 控制上下间距 */
  margin-top: 20px;
}

.user-info-item {
  display: flex;
  justify-content: center; /* 居中对齐 */
  align-items: center;
  width: 300px; /* 固定宽度，适应输入框大小 */
  gap: 10px; /* 控制 label 和 input 之间的间距 */
}

.user-info label {
  font-size: 16px;
  color: #333;
  min-width: 60px; /* 固定 label 宽度 */
  text-align: left; /* 左对齐 */
}

.user-info input {
  flex: 1; /* 输入框自适应宽度 */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  text-align: center;
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
