// src/persistence.ts

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Bill } from "./types.js"; // 假设您的类型定义在 types.ts 中

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 定义数据存储文件的路径
// __dirname 是当前脚本所在的目录 (src/)
// 我们将数据文件存放在项目根目录下的 data/ 文件夹中
const STORAGE_PATH = path.join(__dirname, "../data/bills.json");

/**
 * 确保数据存储目录和文件存在
 */
const ensureStorageExists = () => {
  const dir = path.dirname(STORAGE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(STORAGE_PATH)) {
    fs.writeFileSync(STORAGE_PATH, JSON.stringify([]), "utf8");
  }
};

/**
 * 从文件加载所有账单
 */
const loadAllBills = (): Bill[] => {
  ensureStorageExists();
  const rawData = fs.readFileSync(STORAGE_PATH, "utf8");
  try {
    // 使用 as Bill[] 进行类型断言，告诉TypeScript解析后的数据是Bill数组
    return JSON.parse(rawData) as Bill[];
  } catch (error) {
    console.error("Error parsing bills from storage:", error);
    return [];
  }
};

/**
 * 保存账单到文件
 * @param bill 要保存的账单对象
 */
export const saveBill = (bill: Bill): void => {
  const allBills = loadAllBills();
  const existingIndex = allBills.findIndex((b) => b.id === bill.id);

  if (existingIndex !== -1) {
    allBills[existingIndex] = bill;
  } else {
    allBills.push(bill);
  }

  fs.writeFileSync(STORAGE_PATH, JSON.stringify(allBills, null, 2), "utf8");
};

/**
 * 获取单个账单
 * @param id 账单ID
 */
export const getBill = (id: string): Bill | undefined => {
  const allBills = loadAllBills();
  return allBills.find((b) => b.id === id);
};

/**
 * 更新账单 (此函数与 saveBill 功能重复，可以直接使用 saveBill)
 * @param updatedBill 更新后的账单对象
 */
export const updateBill = (updatedBill: Bill): void => {
  saveBill(updatedBill);
};
