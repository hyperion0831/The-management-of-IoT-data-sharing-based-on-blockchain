<template>
  <div class="real-time-monitoring">
    <div class="file-upload-row">
      <!-- <input type="file" @change="handleFileUpload" />
      <button @click="generateChart">生成图表</button> -->
    </div>
    <h1>实时数据监测</h1>
    <div class="user-section">
      <h2>我的健康数据</h2>
      <div ref="echart" style="width: 100%; height: 600px;"></div>
      <!-- <div class="user-health-data">
        <p>心率：{{ userHealthData.heartRate }} bpm</p>
        <p>血压：{{ userHealthData.bloodPressure }} mmHg</p>
        <p>睡眠状态：{{ userHealthData.sleepStatus }}</p>
      </div> -->
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { io } from 'socket.io-client';

export default {
  data() {
    return {
      userHealthData: {
        heartRate: 85,
        bloodPressure: "120/80",
        sleepStatus: "良好",
      },
      socket: null,
      heartRateData: [],
      heartRateLabels: [],
      stepsArray: [],
    };
  },
  mounted() {
    this.initSocket();
    this.initChart();
    window.addEventListener('resize', this.handleResize);
  },
  beforUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    },
    initSocket() {
      this.socket = io('ws://localhost:5000');
      this.socket.on('connect', () => {
        this.$message.success("TCP服务启动");
      });
      this.socket.on('file_modified', (data) => {
        let dataList = JSON.parse(data.data);
        this.handleSocketData(dataList);
      });
      this.socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
      });
      this.socket.on('disconnect', () => {
        console.log('Socket.IO connection closed');
      });
    },
    handleSocketData(data) {
      console.log('Received data:', data);
      if (data.error) {
        console.error(data.error);
      } else {
        const heartRateArray = Object.values(data['Heart Rate']);
        const stepsArray = Object.values(data['Steps']);
        const timeArray = Object.values(data['Time']);

        const formattedTimeArray = timeArray.map(timestamp => {
          const date = new Date(timestamp);
          return date.toLocaleString();
        });

        this.heartRateData = heartRateArray;
        this.heartRateLabels = formattedTimeArray;
        this.stepsArray = stepsArray;

        this.userHealthData.heartRate = heartRateArray[heartRateArray.length - 1] || this.userHealthData.heartRate;

        this.generateChart();
      }
    },
    initChart() {
      this.chartInstance = echarts.init(this.$refs.echart);
    },
    generateChart() {
      const option = {
      
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['心率', '步数'],
          top: '0%',
          textStyle: {
            color: '#333'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.heartRateLabels,
          axisLabel: {
            rotate: 45,
            textStyle: {
              color: '#333'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '心率',
            position: 'left',
            axisLabel: {
              formatter: '{value} bpm',
              textStyle: {
                color: '#333'
              }
            }
          },
          {
            type: 'value',
            name: '步数',
            position: 'right',
            axisLabel: {
              formatter: '{value} 步',
              textStyle: {
                color: '#333'
              }
            }
          }
        ],
        series: [
          {
            name: '心率',
            type: 'line',
            data: this.heartRateData,
            yAxisIndex: 0,
            smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(75, 192, 192, 0.5)' },
                { offset: 1, color: 'rgba(75, 192, 192, 0.1)' }
              ])
            },
            lineStyle: {
              color: 'rgba(75, 192, 192, 1)',
              width: 2
            },
            label: {
              show: false,
              position: 'top',
              formatter: '{c} bpm'
            }
          },
          {
            name: '步数',
            type: 'line',
            data: this.stepsArray,
            yAxisIndex: 1,
            smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 99, 132, 0.5)' },
                { offset: 1, color: 'rgba(255, 99, 132, 0.1)' }
              ])
            },
            lineStyle: {
              color: 'rgba(255, 99, 132, 1)',
              width: 2
            },
            label: {
              show: false,
              position: 'top',
              formatter: '{c} 步'
            }
          }
        ]
      };

      this.chartInstance.setOption(option);
    },
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
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 26px;
  align-self: flex-start;
  border-bottom: 2px solid #888c92;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 5px;
}

.user-section {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 20px;
  color: #555;
  margin-bottom: 15px;
}

.user-health-data p {
  font-size: 16px;
  color: #444;
  margin-top: 10px;
}
</style>