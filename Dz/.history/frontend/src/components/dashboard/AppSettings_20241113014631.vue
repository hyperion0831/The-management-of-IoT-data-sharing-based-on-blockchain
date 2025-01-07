<template>
  <div class="login">
    <h1>设置</h1>
    <!-- 头像上传框 -->
    <div class="headimg">
      <el-upload
        class="avatar-upload"
        action=""  
        :show-file-list="false"
        :before-upload="handleAvatarUpload"
        accept="image/*"
        @click="triggerFileInput"  
      >
        <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <!-- 身份和姓名显示区域，类似区块链用户名和密码的显示方式 -->
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
    // 头像上传
    triggerFileInput() {
      const fileInput = document.querySelector('.avatar-upload input[type="file"]');
        if (fileInput) {
          fileInput.click(); // 触发文件选择框
        }
    },
    
    //头像显示
    handleAvatarUpload(file) {
      console.log('文件上传中...', file); // 调试信息
      const reader = new FileReader();
      
      reader.onload = (e) => {
        // 将图片数据赋值给 avatarUrl（确保 avatarUrl 已经在 data 或 ref 中声明）
        this.avatarUrl = e.target.result;
      };
      
      reader.readAsDataURL(file); // 将文件读取为 Data URL
      return false; // 阻止默认上传行为
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
      alert("已退出登录");
      this.$router.push({ name: 'Login' });
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


.headimg {  
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
}

.avatar-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border: 2px dashed #d9d9d9;
  border-radius: 50%; /* 圆形边框 */
  overflow: hidden; /* 确保图片不会超出圆形框 */
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片按比例填充整个框 */
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c8c8c;
}

/* 信息卡片样式 */
.user-info-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 500px;
  margin-bottom: 20px;
}

/* 单项信息样式 */
.user-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.user-info-item:last-child {
  border-bottom: none;
}

.user-info label {
  font-size: 16px;
  color: #666;
  font-weight: 600;
}

.user-info input {
  flex: 1;
  font-size: 16px;
  padding: 10px;
  border: none;
  background-color: #f0f2f5;
  border-radius: 8px;
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
