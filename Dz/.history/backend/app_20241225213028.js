import express from 'express';  // 使用 import 导入 express
import bodyParser from 'body-parser';  // 使用 import 导入 body-parser
import cors from 'cors';  // 使用 import 导入 cors
import blockchainRouter from './routers/blockchain.js';  // 导入 blockchain 路由模块，注意添加 .js 后缀

const app = express();
const port = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());// 解析 JSON 请求体

// 挂载区块链路由模块
app.use('/api/blockchain', blockchainRouter);

// 启动服务器
app.listen(port, () => {
    console.log(`服务器正在运行在 http://localhost:${port}`);
});
