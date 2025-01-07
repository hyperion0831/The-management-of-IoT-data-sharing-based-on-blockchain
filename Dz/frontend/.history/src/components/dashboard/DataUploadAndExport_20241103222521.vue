<template>
  <div class="data-upload">
    <h2>数据上传</h2>
    <div class="file-upload-row">
      <input type="file" @change="handleFileUpload" />
      <button @click="generateChart">生成图表</button>
    </div>
    <canvas id="chart" width="400" height="200"></canvas>
    <div class="export-share-row">
      <button @click="exportToCSV">导出为CSV</button>
      <button @click="exportToExcel">导出为Excel</button>
      <button @click="generateShareLink">生成分享链接</button>
    </div>
    <div id="qrcode-container">
      <img v-if="qrCodeImage" :src="qrCodeImage" alt="QR Code" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Chart } from 'chart.js';
import QRCode from 'qrcode';

export default {
  data() {
    return {
      file: null,
      ctx: null,
      qrCodeImage: ''
    };
  },
  mounted() {
    const canvas = document.getElementById('chart');
    if (canvas) {
      this.ctx = canvas.getContext('2d');
    } else {
      console.error('Canvas element not found');
    }
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async uploadData() {
      if (this.file) {
        try {
          const jsonData = await this.uploadFile(this.file);
          console.log(jsonData);
        } catch (err) {
          console.error('Upload error:', err);
        }
      } else {
        alert('请选择一个文件');
      }
    },
    async uploadFile(file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await axios.post('http://localhost:8081/file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return await this.parseExcel(file);
      } catch (err) {
        console.error('Upload failed:', err);
      }
    },
    parseExcel(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          resolve(jsonData);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    },
    generateChart() {
      if (!this.file) {
        alert("请先选择文件");
        return;
      }

      if (!this.ctx) {
        console.error('Canvas context not available');
        return;
      }

      this.parseExcel(this.file).then(jsonData => {
        const labels = jsonData.slice(1).map(row => {
          const date = new Date((row[0] - 25569) * 86400 * 1000);
          return date.toLocaleString('zh-CN', { timeZone: 'UTC' });
        });

        const values = jsonData.slice(1).map(row => row[1]);

        new Chart(this.ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Heart Rate',
              data: values,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              fill: false
            }]
          },
          options: {
            scales: {
              x: { title: { display: true, text: '时间' } },
              y: { title: { display: true, text: '心率' }, beginAtZero: true }
            }
          }
        });
      });
    },
    generateShareLink() {
      const uniqueIdentifier = Date.now();
      const shareLink = `http://example.com/share?id=${uniqueIdentifier}`;
      QRCode.toDataURL(shareLink, (err, url) => {
        if (err) {
          console.error(err);
        } else {
          this.qrCodeImage = url;
          alert(`Share this link: ${shareLink}`);
        }
      });
      return shareLink;
    },
    exportToCSV() {
      this.parseExcel(this.file).then(jsonData => {
        const formattedData = jsonData.map(row => {
          const date = new Date((row[0] - 25569) * 86400 * 1000);
          const formattedDate = date.toLocaleString('zh-CN', {
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }).replace(/\//g, '-').replace(',', '');
          return [formattedDate, row[1]];
        });
        
        const csvContent = "data:text/csv;charset=utf-8," + formattedData.map(row => row.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    exportToExcel() {
      this.parseExcel(this.file).then(jsonData => {
        const formattedData = jsonData.map(row => {
          const date = new Date((row[0] - 25569) * 86400 * 1000);
          const formattedDate = date.toLocaleString('zh-CN', {
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }).replace(/\//g, '-').replace(',', '');
          return [formattedDate, row[1]];
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "data.xlsx");
      });
    }
  }
};
</script>

<style scoped>


.data-upload h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.file-upload-row {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
}

.file-upload-row input[type="file"] {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.file-upload-row button {
  padding: 10px 16px;
  background-color: #e8edf3;  
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.file-upload-row button:hover {
  background-color: #acababcc;
}

#chart {
  margin-top: 20px;
  max-width: 100%;
  max-height: 400px;
}

.export-share-row {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  width: 100%;
  justify-content: space-between;
}

.export-share-row button {
  flex: 1;
  padding: 10px;
  background-color: #e8edf3;  
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.export-share-row button:hover {
  background-color: #acababcc;
}

.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.qr-code-container img {
  width: 150px;
  height: 150px;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
