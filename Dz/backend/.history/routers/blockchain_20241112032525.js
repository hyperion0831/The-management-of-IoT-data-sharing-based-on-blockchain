// backend/routes/blockchain.js
const express = require('express');
const router = express.Router();

router.post('/upload', async (req, res) => {
  const { user, healthData, timestamp } = req.body;

  try {
    // 在这里调用你的区块链智能合约，将数据写入链上
    const result = await blockchainService.uploadHealthData(user, healthData, timestamp);
    res.status(200).send({ success: true, result });
  } catch (error) {
    res.status(500).send({ error: '上传区块链失败', details: error });
  }
});

module.exports = router;
