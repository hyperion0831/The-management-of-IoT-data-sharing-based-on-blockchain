import express from 'express';  // 使用 import 导入 express
import bodyParser from 'body-parser';  // 使用 import 导入 body-parser
import cors from 'cors';  // 使用 import 导入 cors
import { exec } from 'child_process'; // 导入 exec 用于执行 Node.js 脚本
import blockchainRouter from './routers/blockchain.js';  // 导入 blockchain 路由模块，注意添加 .js 后缀

const app = express();
const port = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());  // 解析 JSON 请求体

// 挂载区块链路由模块
app.use('/api/blockchain', blockchainRouter);

// 创建上传数据的接口
app.post('/upload', (req, res) => {
    const { filePath } = req.body; // 获取上传的文件路径

    if (!filePath) {
        return res.status(400).json({ error: '文件路径不能为空' });
    }

    // 执行 SendData.js 脚本
    exec(`node ../services/SendData.js ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`执行错误: ${error}`);
            return res.status(500).json({ error: stderr });
        }
        console.log(`stdout: ${stdout}`);
        res.status(200).json({ success: true, message: '数据上传成功', transactionHash: stdout.trim() });
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器正在运行在 http://localhost:${port}`);
});
