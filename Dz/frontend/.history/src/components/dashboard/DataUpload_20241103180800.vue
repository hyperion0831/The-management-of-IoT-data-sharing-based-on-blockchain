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
import axios from 'axios'
import * as XLSX from 'xlsx'
import { Chart } from 'chart.js'
import QRCode from 'qrcode'

export default {
  data() {
    return {
      qrCodeImage: '',
      file: null,
    }
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    uploadData() {
      if (this.file) {
        // 上传数据的逻辑
      } else {
        alert("请选择一个文件");
      }
    },
    generateChart() {
      const ctx = document.getElementById("chart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["数据1", "数据2"],
          datasets: [{ data: [10, 20], backgroundColor: ["#4CAF50", "#2196F3"] }],
        },
      });
    },
    exportCSV() {
      // 导出 CSV 的逻辑
    },
    exportExcel() {
      // 导出 Excel 的逻辑
    },
    generateShareLink() {
      const url = "https://example.com"; // 替换为实际生成的链接
      QRCode.toDataURL(url, (err, url) => {
        if (err) console.error(err);
        this.qrCodeImage = url;
      });
    },
  },
};
</script>

<style scoped>
/* 在这里添加样式 */
.data-upload {
  text-align: center;
}
</style>
