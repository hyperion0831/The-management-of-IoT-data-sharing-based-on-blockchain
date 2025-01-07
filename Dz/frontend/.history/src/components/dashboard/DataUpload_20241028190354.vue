<template>
  <div class="data-upload">
    <h2>数据上传</h2>
    <input type="file" @change="handleFileUpload" />
    <button @click="uploadData">上传数据</button>
  </div>
</template>
  
<script>
export default {
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },  
    mounted() {
      console.log("Component mounted");
    },
    beforeUnmount() {
      console.log("Component about to unmount");
    },
    uploadData() {
      // 实现数据上传逻辑
    }
  }
}
</script>
  