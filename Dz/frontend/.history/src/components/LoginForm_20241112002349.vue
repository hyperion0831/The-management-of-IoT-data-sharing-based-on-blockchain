<template>
    <div class="loginform">

      <!-- 初始页面 -->
      <div v-if="!isRegistering">
        <h1>欢迎使用智能手表健康监测系统</h1>
    
        <!-- 区块链用户名和密码显示区域 -->
        <div class="blockchain-info">
          <label>区块链用户名：</label>
          <input type="text" v-model="displayPublicKey" readonly />
          <label>密码：</label>
          <input type="text" v-model="displayPrivateKey" readonly />
        </div>
        
        <!-- 登录、注册按钮 -->
        <div class="button-row">
          <button @click="handleRegisterClick">注册</button>
          <button @click="handleLoginClick">登录</button>
        </div>
        
        <!-- 隐藏的文件选择框 -->
        <input
          ref="fileInput"
          type="file"
          accept=".txt"
          style="display: none"
          @change="handleFileUpload"
        />
      </div>
      
      <!-- 注册页面（覆盖整个页面） -->
      <div v-if="isRegistering" class="register-section">
        <h1>注册新用户</h1>
        <label for="identity">选择身份：</label>
        <select v-model="identity">
          <option value="doctor">医生</option>
          <option value="user">普通用户</option>
        </select>
  
        <div v-if="identity === 'doctor'" class="blockchain-info">
          <label for="name">姓名：</label>
          <input type="text" v-model="name" placeholder="请输入姓名" />
          <label for="id">工号：</label>
          <input type="text" v-model="doctorId" placeholder="请输入工号" />
        </div>
        <div v-else class="blockchain-info">
          <label for="name">姓名：</label>
          <input type="text" v-model="name" placeholder="请输入姓名" />
        </div>
  
        <div class="button-row">
          <button @click="generateAndSaveKeyPair">生成密钥对</button>
          <button @click="goToLoginPage">返回登录</button>
        </div>

        <p v-if="keyGenerated">密钥对已生成并保存到文件中。</p>
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
        isRegistering: false, // 是否正在注册,
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
      // 点击登录按钮，弹出文件选择框
      handleLoginClick() {
        this.$refs.fileInput.click();
      },

      // 点击注册按钮后，切换到注册界面
      handleRegisterClick() {
        this.isRegistering = true; // 显示注册界面
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
            this.currentView = 'success'; // 注册成功后切换到 success 视图
            this.$emit('registerSuccess', { identity: this.identity, name: this.name });
          } catch (error) {
              console.error("生成密钥对失败：", error);
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
              const publicKey = publicKeyMatch[1];
              const privateKey = privateKeyMatch[1];
              // 验证密钥对
              this.verifyKeyPair(publicKey, privateKey); // 处理文件内容
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

            // 显示公钥和私钥内容
            this.displayPublicKey = publicKeyBase64;
            this.displayPrivateKey = privateKeyBase64;

            alert(`登录成功！\n欢迎你， ${matchingKey.split('-')[1]}${matchingKey.startsWith('doctor') ? '医生' : '用户'}`);
            this.$router.push({ name: 'DataDashboard' });
          } else {
            alert("未找到匹配的注册信息，请检查密钥文件。");  
          }
        } catch (error) {
          console.error("验证密钥对时出错：", error);
          alert("密钥验证失败，请重新上传正确的密钥文件。");
        }
      },
      
      // 返回登录界面
      goToLoginPage() {
        this.isRegistering = false; // 退出注册界面，显示登录按钮页面
        this.currentView = null; // 清空当前视图
      },

    },
  };
  </script>
  
  <style scoped>
.loginform {
  width: 700px; /* 调整宽度 */
  padding: 25px 30px; /* 增加内边距 */
  margin: 60px auto; /* 居中 */
  background: linear-gradient(145deg, #f0f0f0, #ffffff); /* 添加柔和的渐变背景 */
  border: 1px solid #e0e0e0; /* 边框颜色更浅 */
  border-radius: 16px; /* 调整圆角 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.05); /* 添加双层阴影 */
}

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
  