// 导入模块
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const blockchainRouter = require('./routes/blockchain');

const app = express();
const port = 3000;

//文件保存
const fs = require('fs');
const path = require('path');

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());// 解析 JSON 请求体
// app.use('/api/blockchain', blockchainRouter);

//文件保存
router.post('/uploadHeartRate', (req, res) => {
    const { user, heartRate, timestamp } = req.body;

    // 定义保存路径，例如保存到 Dataset/Uploads 文件夹
    const saveDir = path.join(__dirname, '../Dataset/Uploads');
    if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
    }

    // 定义文件名和保存路径
    const fileName = `${user}-${timestamp}.json`;
    const filePath = path.join(saveDir, fileName);

    // 将数据写入 JSON 文件
    const data = { user, heartRate, timestamp };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.send({ message: `数据已成功保存为 ${fileName}` });
});

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
    console.log(`服务器正在运行在 http://localhost:${PORT}`);
});
