// server/server.ts

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { DataManager, BillCalculator } from "./core";

// 解決 ES6 模塊中的 __dirname 問題
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 初始化數據管理器和計算器 (這將在服務器內存中維護狀態)
const dataManager = new DataManager();
const calculator = new BillCalculator();

// 中間件：解析JSON請求體
app.use(express.json());

// --- API 接口 ---

// 1. 重置或創建新賬單
app.post("/api/bill/reset", (req, res) => {
  // 實際應用中，可能需要根據用戶ID來管理不同賬單
  // 這裡為簡單起見，我們每次都創建一個新的DataManager實例
  // 注意：在真實服務器中，這會導致所有用戶共享同一個賬單狀態
  // 更好的做法是使用數據庫來持久化每個用戶的賬單
  dataManager.reset();
  res.status(200).json({ message: "新賬單已創建" });
});

// 2. 更新賬單基本信息
app.post("/api/bill/info", (req, res) => {
  const { name, date, location, tipPercentage } = req.body;
  dataManager.updateBillInfo(name, date, location, tipPercentage);
  res.status(200).json({ message: "賬單信息已更新" });
});

// 3. 添加參與者
app.post("/api/participant", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "參與者姓名不能为空" });
  }
  const participant = dataManager.addParticipant(name);
  res.status(201).json(participant);
});

// 4. 添加消費項目
app.post("/api/item", (req, res) => {
  const { name, amount, isShared, participantIds } = req.body;
  if (!name || !amount || !participantIds || participantIds.length === 0) {
    return res.status(400).json({ error: "項目信息不完整" });
  }
  const item = dataManager.addItem(name, amount, isShared, participantIds);
  res.status(201).json(item);
});

// 5. 計算賬單
app.get("/api/calculate", (req, res) => {
  const bill = dataManager.getCurrentBill();
  const results = calculator.calculate(bill);
  res.status(200).json({
    bill,
    results,
  });
});

// --- 靜態文件服務和SPA路由支持 ---

// 設置靜態文件目錄，只暴露 public 目錄
app.use(express.static(path.join(__dirname, "../public")));

// 處理所有其他路由，返回 index.html 支持 SPA
app.use(/.*/, (req, res) => {
  const indexPath = path.join(__dirname, "../public/index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Not Found");
  }
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`服務器運行在 http://localhost:${PORT}`);
  console.log(`- 靜態資源來源: public 文件夾`);
  console.log(`- API 根路徑: /api`);
});
