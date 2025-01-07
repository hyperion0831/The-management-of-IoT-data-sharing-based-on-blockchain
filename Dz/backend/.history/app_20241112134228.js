// 导入模块
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const blockchainRouter = require('./routes/blockchain');

const app = express();
const port = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());// 解析 JSON 请求体
app.use('/api/blockchain', blockchainRouter);

// 示例接口，返回健康数据
app.get('/api/healthData', (req, res) => {
  const data = {
    heartRate: 72,
    bloodPressure: '120/80',
  };
  res.json(data);
});

// 路由示例：上传心率数据
app.post('/api/uploadHeartRate', async (req, res) => {
    const { user, heartRate, timestamp } = req.body;
  
    try {
      console.log(`接收到数据 - 用户: ${user}, 心率: ${heartRate}, 时间: ${timestamp}`);
      // 假设我们简单地在控制台输出数据
      // 实际应用中，你可能会将数据存储到数据库中，如 MongoDB 或 MySQL
      res.status(200).send({ message: '数据已成功上传' });
    } catch (error) {
      console.error('存储数据失败:', error);
      res.status(500).send({ error: '存储数据失败' });
    }
  });

// 启动服务器
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
