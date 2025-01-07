const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 示例接口，返回健康数据
app.get('/api/healthData', (req, res) => {
  const data = {
    heartRate: 72,
    bloodPressure: '120/80',
  };
  res.json(data);
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
