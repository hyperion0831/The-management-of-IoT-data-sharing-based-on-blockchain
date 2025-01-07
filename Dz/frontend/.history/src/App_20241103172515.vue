<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
//import Uploaddata from './components/up.vue';
import DataUploads from './components/datauploads.vue';
import { defineComponent } from 'vue';

export default {
  name: 'App'
};
export default defineComponent({
  name: 'DataUploads',
  //name: 'Uploaddata'
  // 组件的配置
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
