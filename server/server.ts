// server/server.ts

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"; // 建議在文件頂部導入 fs

// 解決 ES6 模塊中的 __dirname 問題
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 設置靜態文件目錄
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../build")));

// --- 再次修改這部分 ---
// 使用正則表達式 /.*/ 來匹配所有路徑
app.use(/.*/, (req, res) => {
  const buildIndexPath = path.join(__dirname, "../build/index.html");
  const publicIndexPath = path.join(__dirname, "../public/index.html");

  try {
    // 建議使用 fs.existsSync，語義更清晰
    if (fs.existsSync(buildIndexPath)) {
      res.sendFile(buildIndexPath);
    } else {
      res.sendFile(publicIndexPath);
    }
  } catch (err) {
    // 如果兩個文件都找不到，返回一個錯誤
    res.status(500).send("Server error: Could not find index.html");
    console.error("Error serving index.html:", err);
  }
});
// --- 修改結束 ---

// 啟動服務器
app.listen(PORT, () => {
  console.log(`服務器運行在 http://localhost:${PORT}`);
  console.log(`- 靜態資源來源: public 和 build 文件夾`);
});
