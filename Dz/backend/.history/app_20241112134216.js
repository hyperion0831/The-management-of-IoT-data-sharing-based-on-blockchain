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


// 启动服务器
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
