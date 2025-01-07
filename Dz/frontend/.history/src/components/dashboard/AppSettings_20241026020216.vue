<template>
    <div class="settings">
      <h2>设置</h2>
      <label>刷新频率：</label>
      <select v-model="refreshRate">
        <option value="5">5秒</option>
        <option value="10">10秒</option>
        <option value="30">30秒</option>
      </select>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        refreshRate: 10
      };
    }
  }
  </script>
  