<template>
  <div class="datadashboard">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <h2 class="sidebar-title">菜单</h2>
      <ul>
        <li :class="{ active: activeModule === 'RealTimeMonitoring' }" @click="selectModule('RealTimeMonitoring')">
          实时数据监测
        </li>
        <li :class="{ active: activeModule === 'DataUploadAndExport' }" @click="selectModule('DataUploadAndExport')">
          数据上传与导出
        </li>
        <li :class="{ active: activeModule === 'DataAnalysis' }" @click="selectModule('DataAnalysis')">
          数据分析
        </li>
        <li :class="{ active: activeModule === 'AppSettings' }" @click="selectModule('AppSettings')">
          设置
        </li>
      </ul>
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

import DataUploadAndExport from './dashboard/DataUploadAndExport.vue';
import RealTimeMonitoring from './dashboard/RealTimeMonitoring.vue';
import DataAnalysis from './dashboard/DataAnalysis.vue';
import AppSettings from './dashboard/AppSettings.vue';


export default {
  name: 'DataDashBoard',
  components: {
    RealTimeMonitoring,
    DataUploadAndExport,
    DataAnalysis,
    AppSettings,
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
        DataUploadAndExport: 'DataUploadAndExport',
        DataAnalysis: 'DataAnalysis',
        AppSettings: 'AppSettings',
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
  }
};
</script> 

<style scoped>
.datadashboard {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
}

/* 左侧导航栏样式 */
.sidebar {
  width: 220px;
  padding: 20px;
  background-color: #4d4d4d;
  color: #ffffff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin: 15px 0;
  padding: 10px;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  text-align: center;
}

li:hover {
  background-color: #3b4252;
  color: #ffffff;
  font-weight: bold;
}

li.active {
  background-color: #4c566a;
  color: #ffffff;
  font-weight: bold;
}

/* 主内容区域样式 */
.content {
  flex: 1;
  padding: 30px;
  background-color: #ffffff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  overflow-y: auto;
}

.login-button {
  margin-top: 20px;
  padding: 10px;
  width: 100%;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #0056b3;
}
</style>
