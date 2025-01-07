<template>
  <div class="real-time-monitoring">
    <h1>实时数据监测</h1>
    
    <!-- 医生界面 -->
    <div v-if="isDoctor" class="doctor-section">
      <div class="patient-select">
        <label>查看病人</label>
        <select v-model="selectedPatient" @change="onPatientChange">
          <option v-for="patient in patients" :key="patient.id" :value="patient.name">
            {{ patient.name }}
          </option>
        </select>
      </div>

      <!-- 心率图表 -->
      <div v-if="selectedPatientData">
        <h2>{{ selectedPatient }} 的健康数据</h2>
        <canvas id="patientHeartRateChart"></canvas>
      </div>
    </div>

    <!-- 用户界面 -->
    <div v-else class="user-section">
      <h2>我的健康数据</h2>
      <canvas id="heartRateChart"></canvas>
      <div class="user-health-data">
        <p>心率：{{ userHealthData.heartRate }} bpm</p>
        <p>血压：{{ userHealthData.bloodPressure }} mmHg</p>
        <p>睡眠状态：{{ userHealthData.sleepStatus }}</p>
      </div>
    </div>
  </div>
</template>
