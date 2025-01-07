import express from 'express';
import { uploadHealthData } from '../services/blockchainService.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// 上传健康数据并保存到本地和区块链
router.post('/uploadHealthData', async (req, res) => {
  const { user, healthData, timestamp } = req.body;
  const saveDir = path.resolve(__dirname, '../dataset/Uploads');

  try {
    // 1. 创建保存目录
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }

    // 2. 生成唯一文件名并检查是否已存在
    const uniqueFileName = `${user}-${timestamp}-${Date.now()}.json`;
    const filePath = path.join(saveDir, uniqueFileName);

    if (fs.existsSync(filePath)) {
      return res.status(400).send({ error: '文件已存在，上传失败' });
    }

    // 3. 保存数据到本地文件
    const data = { user, healthData, timestamp };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    // 4. 上传数据到区块链
    const result = await uploadHealthData(user, healthData, timestamp);

    res.status(200).send({
      success: true,
      message: `数据已保存为 ${uniqueFileName}`,
      blockchainResult: result,
    });
  } catch (error) {
    console.error('上传健康数据时发生错误:', error);
    res.status(500).send({
      error: '上传失败',
      details: error.message,
    });
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

export default router;
