<template>
  <div class="step-count-analysis">
    <!-- <div class="file-upload-row">
      <input type="file" @change="handleFileUpload" accept=".xlsx,.xls" />
    </div> -->
    <h2>运动与健康</h2>
    <canvas id="stepChart" width="400" height="200"></canvas>
    <div v-if="stepData.length">
      <h3>基本统计指标</h3>
      <p>最大步数: {{ maxSteps }}</p>
      <p>最小步数: {{ minSteps }}</p>
      <p>累计步数: {{ cumulativeSteps }}</p>
      <p>最高心率: {{ maxHeartRate }}</p> 
      <p>最低心率: {{ minHeartRate }}</p>
      <p>平均心率: {{ averageHeartRate }}</p>
      <p>运动评价: {{ performanceRating }}</p>
      <p>运动强度: {{ intensityMessage }}</p>
      <p>健康状态: {{ overallMessage }}</p>
    </div>
    <div class="export-share-row">
      <button @click="exportToCSV">导出为CSV</button>
      <button @click="exportToExcel">导出为Excel</button>
      <button @click="generateShareLink">分享运动情况</button>
    </div>
    <div v-if="showQRCode" class="qr-modal" @click="closeQRCode">
      <div class="qr-modal-content" @click.stop>
        <span class="close" @click="closeQRCode">&times;</span>
        <img v-if="qrCodeImage" :src="qrCodeImage" alt="QR Code" />
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { Chart, registerables } from 'chart.js';
import QRCode from 'qrcode';
import { io } from 'socket.io-client';
export default {
  data() {
    return {
      stepData: [],
      maxSteps: 0,
      minSteps: 0,
      cumulativeSteps: 0,
      maxHeartRate: 0, 
      minHeartRate: 0, 
      averageHeartRate: 0,
      performanceRating: '',
      intensityMessage: '',
      overallMessage: '',
      chartData: {
        labels: [],
        datasets: [
          {
            label: '运动强度',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          }
        ]
      },
      ctx: null,
      qrCodeImage: null,
      showQRCode: false,
      file: null,
    };
  },
  mounted() {
    Chart.register(...registerables);
    const canvas = document.getElementById('stepChart');
    if (canvas) {
      this.ctx = canvas.getContext('2d');
    } else {
      console.error('Canvas element not found');
    }
    this.initSocket();
  },
  methods: {
    initSocket() {
      console.log("ahahahah")
      this.socket = io('ws://192.168.31.160:5000');
      this.socket.emit('custom_event');
      this.socket.on('custom_event_response', (data) => {
        let responseData = data.data.data
            console.log(responseData, 'stepData..')
            this.stepData = responseData
            this.calculateStatistics();
            this.updateChartData();
      });
      this.socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
      });
      this.socket.on('disconnect', () => {
        console.log('Socket.IO connection closed');
      });
    },
    // this.parseExcel(this.file).then(JSON => {
    //     console.log(JSON, 'kaspd')
    //   })
    //   if (this.file) {
    //     const formData = new FormData();
    //     formData.append('file', this.file);

    //     fetch('http://192.168.31.160:5000/upload', {
    //       method: 'POST',
    //       body: formData,
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //       if (data.status === 'success') {
            
    //         let responseData = JSON.parse(data.data);
    //         console.log(this.stepData, 'stepData..')
           
    //         dataList.push(Object.keys(responseData))
    //         this.calculateStatistics();
    //         this.updateChartData();
    //       } else {
    //         console.error('Error uploading file:', data.message);
    //       }
    //     })
    //     .catch(err => {
    //       console.error('Error uploading file:', err);
    //     });
    //   }
    // },
    // handleFileUpload(event) {
    //   this.file = event.target.files[0];
    //   if (this.file) {
    //     const formData = new FormData();
    //     formData.append('file', this.file);

    //     fetch('http://192.168.31.160:5000/upload', {
    //       method: 'POST',
    //       body: formData,
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //       if (data.status === 'success') {
    //         console.log(data, 'data..')
    //         let responseData = data.data.data
    //         console.log(responseData, 'stepData..')
          
    //         this.stepData = responseData
    //         this.calculateStatistics();
    //         this.updateChartData();
    //       } else {
    //         console.error('Error uploading file:', data.message);
    //       }
    //     })
    //     .catch(err => {
    //       console.error('Error uploading file:', err);
    //     });
    //   }
    // },
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
    calculateStatistics() {
      const steps = this.stepData.slice(1).map(data => data[1]);
      const heartRates = this.stepData.slice(1).map(data => data[2]);

      // 处理数据前的检查
      if (steps.length === 0 || heartRates.length === 0) {
        console.error("没有有效数据");
        return;
      }

      this.maxSteps = Math.max(...steps);
      this.minSteps = Math.min(...steps);
      this.cumulativeSteps = this.maxSteps - this.minSteps;

      // 计算平均心率
      const totalHeartRate = heartRates.reduce((sum, rate) => sum + rate, 0);
      this.averageHeartRate = (totalHeartRate / heartRates.length).toFixed(2);

      // 计算最高心率和最低心率
      this.maxHeartRate = Math.max(...heartRates);
      this.minHeartRate = Math.min(...heartRates);

      // 评分标准
      let heartRateClass;
      if (this.averageHeartRate < 60) {
        heartRateClass = 1;  // 较低心率
      } else if (this.averageHeartRate <= 100) {
        heartRateClass = 2;  // 正常范围
      } else {
        heartRateClass = 3;  // 较高心率
      }

      let stepsClass;
      if (this.cumulativeSteps < 5000) {
        stepsClass = 1;  // 缺乏运动
      } else if (this.cumulativeSteps <= 8000) {
        stepsClass = 2;  // 正常活动
      } else if (this.cumulativeSteps <= 12000) {
        stepsClass = 3;  // 良好的运动量
      } else if (this.cumulativeSteps <= 16000) {
        stepsClass = 4;  // 较高运动量
      } else {
        stepsClass = 5;  // 过高运动量
      }
      
      // 显示汉字评分
      const heartRateScores = ["较低", "正常", "较高"];
      const stepsScores = ["缺乏运动", "正常活动", "良好的运动量", "较高运动量", "过高运动量"];

      // 综合评价
      this.performanceRating = `平均心率评价: ${heartRateScores[heartRateClass - 1]}, 累计步数评价: ${stepsScores[stepsClass - 1]}`;
      // 评估运动强度
      this.evaluateHealth(heartRates);
      // 综合健康状况评价
      this.overallMessage = this.generateOverallMessage(heartRateClass, stepsClass);
    },
    generateOverallMessage(heartRateClass, stepsClass) {
      let message = "";

      // 心率评价
      if (heartRateClass === 1) {
        message += "心率较低，可能需要增加锻炼以提高心率。";
      } else if (heartRateClass === 2) {
        message += "心率正常，说明心脏健康状况良好。";
      } else {
        message += "心率较高，建议关注心脏健康。";
      }

      // 步数评价
      if (stepsClass === 1) {
        message += "步数较少，建议增加日常活动量。";
      } else if (stepsClass === 2) {
        message += "步数正常，保持当前活动水平。";
      } else if (stepsClass === 3) {
        message += "步数良好，继续保持积极的运动习惯。";
      } else if (stepsClass === 4) {
        message += "步数较多，适当休息以避免过度运动。";
      } else {
        message += "步数过多，请注意身体状态，适当放松。";
      }
      return message;
    },
    evaluateHealth(heartRates) {
      const MHR = 220 - 30; // 计算最大心率（假设年龄为30岁）
      const HRR = MHR - 60; // 计算心率储备
      const intensityData = heartRates.map(heartRate => {
        return ((heartRate - 60) / HRR) * 100; // 计算活动强度
      });

      console.log("运动强度数据:", intensityData); // Debug log

      // 计算平均运动强度
      const averageIntensity = intensityData.reduce((sum, intensity) => sum + intensity, 0) / intensityData.length;

      // 根据平均运动强度进行评价
      if (averageIntensity < 50) {
        this.intensityMessage = "平均运动强度过低";
      } else if (averageIntensity < 60) {
        this.intensityMessage = "低强度运动";
      } else if (averageIntensity < 70) {
        this.intensityMessage = "中等强度运动";
      } else if (averageIntensity < 80) {
        this.intensityMessage = "中高强度运动";
      } else if (averageIntensity < 90) {
        this.intensityMessage = "高强度运动";
      } else {
        this.intensityMessage = "极高强度运动";
      }

      //更新图表
      this.chartData.datasets[0].data = intensityData;

      // 显示平均运动强度
      this.intensityMessage += ` (平均强度: ${averageIntensity.toFixed(2)}%)`;
    },
    updateChartData() {
      this.chartData.labels = this.stepData.slice(1).map(row => {
        const date = new Date((row[0] - 25569) * 86400 * 1000);
        return date.toLocaleString('zh-CN', { timeZone: 'UTC' });
      });

      

      console.log("图表数据:", this.chartData); // Debug log

      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // 清除画布
        new Chart(this.ctx, {
          type: 'line',
          data: this.chartData,
          options: {
            scales: {
              x: { title: { display: true, text: '时间' } },
              y: { title: { display: true, text: '运动强度 (%)' }, beginAtZero: true }
            }
          }
        });
      }
    },
    generateShareLink() {
      const startTime = new Date((this.stepData[1][0] - 25569) * 86400 * 1000).toLocaleString('zh-CN', { timeZone: 'UTC' });
      const endTime = new Date((this.stepData[this.stepData.length - 1][0] - 25569) * 86400 * 1000).toLocaleString('zh-CN', { timeZone: 'UTC' });
      const shareLink = `http://example.com/share?id=${Date.now()}`;
      const message = `用户 DDS 在 ${startTime} 到 ${endTime} 时间段内运动了 ${this.cumulativeSteps} 步。\n` +
                  `运动评价为: ${this.performanceRating}。\n` +
                  `最高心率: ${this.maxHeartRate}。\n` +
                  `最低心率: ${this.minHeartRate}。\n` +
                  `平均心率: ${this.averageHeartRate}。\n` +
                  `运动强度: ${this.intensityMessage}。\n` +
                  `综合健康状况: ${this.overallMessage}。`;
  
      QRCode.toDataURL(message, (err, url) => {
        if (err) {
          console.error(err);
        } else {
          this.qrCodeImage = url;
          this.showQRCode = true; // 显示弹窗
        }
      });
      return shareLink;
    },
    closeQRCode() {
      this.showQRCode = false; // 关闭弹窗
      this.qrCodeImage = null; // 清空二维码图片
    },
    exportToCSV() {
      if (!this.stepData.length) return alert("没有数据可导出");
      
      const formattedData = this.stepData.slice(1).map(row => {
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
        return [formattedDate, row[1], row[2]]; // 包含心率
      });
      
      const csvContent = "data:text/csv;charset=utf-8," + formattedData.map(row => row.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    exportToExcel() {
      if (!this.stepData.length) return alert("没有数据可导出");
      
      const formattedData = this.stepData.slice(1).map(row => {
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
        return [formattedDate, row[1], row[2]]; // 包含心率
      });

      const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "data.xlsx");
    }
  }
};
</script>

<style scoped>
.step-count-analysis h2 {
  font-size: 24px;
  align-self: flex-start; /* 将标题移到左边 */
  border-bottom: 2px solid #888c92; /* 添加下划线 */
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 5px;
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

#chart {
  margin-top: 20px;
  max-width: 100%;
  max-height: 400px;
}

.step-count-analysis div {
  margin-top: 20px;
}

.step-count-analysis h3 {
  font-size: 20px;
  color: #333;
}

.step-count-analysis p {
  font-size: 16px;
  color: #555;
  margin: 5px 0;
}

.step-count-analysis p span {
  font-weight: bold;
}

/* 弹窗样式 */
.qr-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
}

.qr-modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.close {
  cursor: pointer;
  font-size: 20px;
  color: #aaa;
}
.close:hover {
  color: black;
}
</style>