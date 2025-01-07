import express from 'express';
import blockchainService from '../services/blockchainService.js';  // 注意添加 .js 后缀
import fs from 'fs';
import path from 'path';

const router = express.Router();

// 上传健康数据并保存到本地和区块链
router.post('/uploadHealthData', async (req, res) => {
  const { user, healthData, timestamp } = req.body;
  const saveDir = path.join(__dirname, '../dataset/Uploads');

  try {
      // 1. 创建保存目录
      if (!fs.existsSync(saveDir)) {
          fs.mkdirSync(saveDir, { recursive: true });
      }

      // 2. 保存数据到本地文件
      const fileName = `${user}-${timestamp}.json`;
      const filePath = path.join(saveDir, fileName);
      const data = { user, healthData, timestamp };
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      // 3. 上传数据到区块链
      const result = await blockchainService.uploadHealthData(user, healthData, timestamp);

      res.status(200).send({ success: true, message: `数据已保存为 ${fileName}`, blockchainResult: result });
  } catch (error) {
      res.status(500).send({ error: '上传失败', details: error });
  }
});

// 获取示例健康数据
router.get('/healthData', (req, res) => {
  const data = {
      heartRate: 72,
      bloodPressure: '120/80',
  };
  res.json(data);
});

export default router;  // 使用export default导出路由
