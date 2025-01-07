<template>
  <div class="datadashboard">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <ul>
        <li @click="selectModule('RealTimeMonitoring')">实时数据监测</li>
        <li @click="selectModule('DataUpload')">数据上传</li>
        <li @click="selectModule('DataExport')">数据导出</li>
        <li @click="selectModule('DataAnalysis')">数据分析</li>
        <li @click="selectModule('AppSettings')">设置</li>
      </ul>
      <button class="login-button" @click="goToLogin">登录</button> <!-- 添加登录按钮 -->

    </div>

    <!-- 主内容区域 -->
    <div class="content">
      
      <keep-alive>        
        <component 
          :is="activeModuleComponent" 
          v-bind="getModuleProps(activeModule)" 
          @switchToCheckList="selectModule('RealTimeMonitoring')" 
        />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import DataUpload from './dashboard/DataUpload.vue';
import DataExport from './dashboard/DataExport.vue';
import RealTimeMonitoring from './dashboard/RealTimeMonitoring.vue';
import DataAnalysis from './dashboard/DataAnalysis.vue';
import AppSettings from './dashboard/AppSettings.vue';
import AppLogin from './dashboard/AppLogin.vue';


export default {
  name: 'DataDashBoard',
  components: {
    RealTimeMonitoring,
    DataUpload,
    DataExport,
    DataAnalysis,
    AppSettings,
    AppLogin,
  },
  data() {
    return {
      activeModule: 'RealTimeMonitoring', // 设置初始模块
      publishedItems: [], // 用于存储数据内容
      userInfo: null, // 保存用户信息
    };
  },
  created() {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      this.userRole = userInfo.identity;
      this.userName = userInfo.name;
      this.doctorId = userInfo.doctorId;
    }
  },
  computed: {
    activeModuleComponent() {
      // 根据 activeModule 动态返回组件名称
      const componentMap = {
        RealTimeMonitoring: 'RealTimeMonitoring',
        DataUpload: 'DataUpload',
        DataExport: 'DataExport',
        DataAnalysis: 'DataAnalysis',
        AppSettings: 'AppSettings',
        AppLogin: 'AppLogin',
      };
      return componentMap[this.activeModule] || 'div';
    },
  },
  methods: {
    selectModule(module) {
      this.activeModule = module;
    },
    getModuleProps(module) {
      // 动态传递组件属性
      if (module === 'RealTimeMonitoring') {
        return { items: this.publishedItems };
      }
      return {};
    },
    handleDataSubmit(dataContent) {
      if (dataContent) {
        this.publishedItems.push(dataContent); // 将数据内容添加到列表中
        this.activeModule = 'RealTimeMonitoring'; // 切换到实时数据监测模块显示
      }
    },
    //登录
    goToLogin() {
      this.activeModule = 'AppLogin'; // 切换到登录模块    }
    },
  }
};
</script> 

<style scoped>
.datadashboard {
  display: flex;
}
.sidebar {
  width: 200px;
  padding: 10px;
  background-color: #f5f5f5;
}
.content {
  flex: 1;
  padding: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 10px 0;
  cursor: pointer;
}
li:hover {
  font-weight: bold;
}
.login-button {
  margin-top: 20px; /* 添加一些间距 */
  padding: 10px; 
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}
.login-button:hover {
  background-color: #0056b3; /* 鼠标悬停效果 */
}
</style>
