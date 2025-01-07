<!-- StepCountAnalysis.vue -->
<template>
    <div class="step-count-analysis">
      <h2>运动步数数据分析</h2>
      <canvas id="stepChart" width="400" height="200"></canvas>
      <div v-if="stepData.length">
        <h3>基本统计指标</h3>
        <p>总步数: {{ totalSteps }}</p>
        <p>平均步数: {{ averageSteps }}</p>
        <p>最大步数: {{ maxSteps }}</p>
        <p>最小步数: {{ minSteps }}</p>
      </div>
      <div class="export-share-row">
        <button @click="exportToCSV">导出为CSV</button>
        <button @click="exportToExcel">导出为Excel</button>
        <button @click="generateShareLink">生成分享链接</button>
      </div>
    </div>
    <div class="file-upload-row">
        <input type="file" @change="handleFileUpload" accept=".xlsx,.xls" />
      </div>
  </template>
  
  <script>
  import * as XLSX from 'xlsx';
  import { Chart, registerables } from 'chart.js';
  
  export default {
    data() {
      return {
        stepData: [],
        totalSteps: 0,
        averageSteps: 0,
        maxSteps: 0,
        minSteps: 0,
        chartData: {
          labels: [],
          datasets: [
            {
              label: '步数',
              data: [],
              borderColor: 'rgba(255, 159, 64, 1)',
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              fill: true,
            }
          ]
        },
        ctx: null
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
    },
    methods: {
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.parseExcel(file).then(jsonData => {
            this.stepData = jsonData;
            this.calculateStatistics();
            this.updateChartData();
          }).catch(err => {
            console.error('Error parsing file:', err);
          });
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
      calculateStatistics() {
        const steps = this.stepData.slice(1).map(data => data[1]); // 假设第二列为步数数据
        this.totalSteps = steps.reduce((a, b) => a + b, 0);
        this.averageSteps = (this.totalSteps / steps.length).toFixed(2);
        this.maxSteps = Math.max(...steps);
        this.minSteps = Math.min(...steps);
      },
      updateChartData() {
        const labels = this.stepData.slice(1).map(row => {
          const date = new Date((row[0] - 25569) * 86400 * 1000); // 假设第一列为日期
          return date.toLocaleString('zh-CN', { timeZone: 'UTC' });
        });
  
        const values = this.stepData.slice(1).map(row => row[1]); // 假设第二列为步数数据
        this.chartData.labels = labels;
        this.chartData.datasets[0].data = values;
  
        if (this.ctx) {
          this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // 清除画布
          new Chart(this.ctx, {
            type: 'line',
            data: this.chartData,
            options: {
              scales: {
                x: { title: { display: true, text: '时间' } },
                y: { title: { display: true, text: '步数' }, beginAtZero: true }
              }
            }
          });
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .data-analysis h2 {
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
  
  .data-analysis div {
    margin-top: 20px;
  }
  
  .data-analysis h3 {
    font-size: 20px;
    color: #333;
  }
  
  .data-analysis p {
    font-size: 16px;
    color: #555;
    margin: 5px 0;
  }
  
  .data-analysis p span {
    font-weight: bold;
  }
  
  </style>