<template>
  <div>
      <input type="file" id="file" accept=".xls, .xlsx" />
      <button @click="uploadFile">上传</button>
      <button @click="generateChart">生成图表</button>
      <canvas id="Chart" width="400" height="200"></canvas>
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
          qrCodeImage: ''
      }
  },
  methods: {
      uploadFile() {
          // 上传文件的逻辑
      },
      generateChart() {
          // 使用 Chart.js 生成图表的逻辑
      },
      exportCSV() {
          // 导出 CSV 的逻辑
      },
      exportExcel() {
          // 导出 Excel 的逻辑
      },
      generateShareLink() {
          // 生成分享链接的逻辑，并将其转换为二维码
          const url = 'https://example.com' // 替换为生成的链接
          QRCode.toDataURL(url, (err, url) => {
              if (err) return console.error(err)
              this.qrCodeImage = url
          })
      }
  }
}
</script>

<style scoped>
/* 在这里添加样式 */
</style>
