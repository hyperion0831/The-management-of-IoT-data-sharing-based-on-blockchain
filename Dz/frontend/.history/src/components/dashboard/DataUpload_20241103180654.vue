<template>
  <div class="data-upload">
    <h2>数据上传</h2>
    <input type="file" @change="handleFileUpload" accept=".xls, .xlsx" />
    <button @click="uploadData">上传数据</button>
    <button @click="generateChart">生成图表</button>
    <canvas id="chart" width="400" height="200"></canvas>
    <button @click="exportCSV">导出为CSV</button>
    <button @click="exportExcel">导出为Excel</button>
    <button @click="generateShareLink">生成分享链接</button>
    <div id="qrcode-container">
      <img :src="qrCodeImage" alt="QR Code" />
    </div>
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
  