<template>
  <div class="data-analysis">
    <h2>数据分析</h2>
    <div class="file-upload-row">
      <input type="file" @change="handleFileUpload" accept=".xlsx,.xls" />
    </div>
    <canvas id="chart" width="400" height="200"></canvas>
    <div v-if="heartRateData.length">
      <h3>基本统计指标</h3>
      <p>平均心率: {{ averageHeartRate }}</p>
      <p>最大心率: {{ maxHeartRate }}</p>
      <p>最小心率: {{ minHeartRate }}</p>
      <p>心率变异性: {{ heartRateVariability }}</p>
      <p>心率水平分析: {{ heartRateLevelAnalysis }}</p>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { Chart, registerables } from 'chart.js';

export default {
  data() {
    return {
      heartRateData: [],
      averageHeartRate: 0,
      maxHeartRate: 0,
      minHeartRate: 0,
      heartRateVariability: 0,
      heartRateLevelAnalysis: '',
      chartData: {
        labels: [],
        datasets: [
          {
            label: '心率',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          }
        ]
      },
      ctx: null
    };
  },
  mounted() {
    Chart.register(...registerables);
    const canvas = document.getElementById('chart');
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
          this.heartRateData = jsonData;
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
      const heartRates = this.heartRateData.slice(1).map(data => data[1]); // 假设第二列为心率数据
      this.averageHeartRate = (heartRates.reduce((a, b) => a + b, 0) / heartRates.length).toFixed(2);
      this.maxHeartRate = Math.max(...heartRates);
      this.minHeartRate = Math.min(...heartRates);
      this.heartRateVariability = this.calculateHeartRateVariability(heartRates);
      this.heartRateLevelAnalysis = this.analyzeHeartRateLevels(heartRates);
    },
    calculateHeartRateVariability(heartRates) {
      const mean = this.averageHeartRate;
      const variance = heartRates.map(rate => Math.pow(rate - mean, 2)).reduce((a, b) => a + b, 0) / heartRates.length;
      return Math.sqrt(variance).toFixed(2);
    },
    analyzeHeartRateLevels(heartRates) {
      const thresholds = {
        low: 60,
        normal: 80,
        high: 100
      };
      const lowCount = heartRates.filter(rate => rate < thresholds.low).length;
      const normalCount = heartRates.filter(rate => rate >= thresholds.low && rate < thresholds.normal).length;
      const highCount = heartRates.filter(rate => rate >= thresholds.normal && rate < thresholds.high).length;

      return `低心率: ${lowCount}, 正常心率: ${normalCount}, 高心率: ${highCount}`;
    },
    updateChartData() {
      const labels = this.heartRateData.slice(1).map(row => {
        const date = new Date((row[0] - 25569) * 86400 * 1000); // 假设第一列为日期
        return date.toLocaleString('zh-CN', { timeZone: 'UTC' });
      });

      const values = this.heartRateData.slice(1).map(row => row[1]); // 假设第二列为心率数据
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
              y: { title: { display: true, text: '心率' }, beginAtZero: true }
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
