// src/persistence.ts
import { Bill } from "./types";

const STORAGE_KEY = "pbc_bills";

/**
 * 从localStorage加载所有账单
 */
const loadAllBills = (): Bill[] => {
  const storedBills = localStorage.getItem(STORAGE_KEY);
  return storedBills ? JSON.parse(storedBills) : [];
};

/**
 * 保存账单到localStorage
 * @param bill 要保存的账单对象
 */
export const saveBill = (bill: Bill): void => {
  const allBills = loadAllBills();
  // 检查是否已存在，存在则更新，不存在则添加
  const existingIndex = allBills.findIndex((b) => b.id === bill.id);
  if (existingIndex !== -1) {
    allBills[existingIndex] = bill;
  } else {
    allBills.push(bill);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allBills));
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
 * 更新账单
 * @param updatedBill 更新后的账单对象
 */
export const updateBill = (updatedBill: Bill): void => {
  saveBill(updatedBill); // saveBill函数已经处理了更新逻辑
};
