// src/dataManager.ts
import { Bill, Participant, Item } from "./types";
import { saveBill, getBill, updateBill } from "./persistence"; // 假设的持久化模块

// 生成唯一ID的简单工具函数
const generateId = () => Math.random().toString(36).substring(2, 9);

export class DataManager {
  private currentBill: Bill;

  constructor() {
    // 初始化一个新账单
    this.currentBill = {
      id: generateId(),
      name: "",
      date: new Date().toISOString().split("T")[0], // 默认今天
      location: "",
      tipPercentage: 0,
      participants: [],
      items: [],
    };
  }

  // --- 账单信息操作 ---
  updateBillInfo(
    name: string,
    date: string,
    location: string,
    tipPercentage: number
  ): void {
    this.currentBill.name = name;
    this.currentBill.date = date;
    this.currentBill.location = location;
    this.currentBill.tipPercentage = tipPercentage;
  }

  // --- 参与者操作 ---
  addParticipant(name: string): Participant {
    const newParticipant: Participant = { id: generateId(), name };
    this.currentBill.participants.push(newParticipant);
    return newParticipant;
  }

  removeParticipant(id: string): void {
    this.currentBill.participants = this.currentBill.participants.filter(
      (p) => p.id !== id
    );
    // 同时从项目中移除该参与者
    this.currentBill.items.forEach((item) => {
      item.participantIds = item.participantIds.filter((pId) => pId !== id);
    });
  }

  // --- 项目操作 ---
  addItem(
    name: string,
    amount: number,
    isShared: boolean,
    participantIds: string[]
  ): Item {
    const newItem: Item = {
      id: generateId(),
      name,
      amount,
      isShared,
      participantIds,
    };
    this.currentBill.items.push(newItem);
    return newItem;
  }

  removeItem(id: string): void {
    this.currentBill.items = this.currentBill.items.filter((i) => i.id !== id);
  }

  updateItemParticipants(itemId: string, participantIds: string[]): void {
    const item = this.currentBill.items.find((i) => i.id === itemId);
    if (item) {
      item.participantIds = participantIds;
    }
  }

  // --- 数据持久化 ---
  saveAsDraft(): void {
    saveBill(this.currentBill);
  }

  // --- 获取当前账单 ---
  getCurrentBill(): Bill {
    return { ...this.currentBill }; // 返回一个副本，防止外部直接修改
  }
}
