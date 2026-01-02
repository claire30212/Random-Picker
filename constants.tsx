import { DrawType, DrawConfig } from './types';
import { Sparkles, Shuffle, User, Gift, Dices, Clock, AlignCenterVertical } from 'lucide-react';

export const DRAW_MODES: Record<DrawType, DrawConfig> = {
  [DrawType.PICK_N]: {
    type: DrawType.PICK_N,
    title: "隨機抽選 (Pick X)",
    description: "從名單中隨機抽出指定數量的幸運兒。",
    icon: "Sparkles",
    requireCount: true
  },
  [DrawType.SHUFFLE]: {
    type: DrawType.SHUFFLE,
    title: "隨機排序 (Shuffle)",
    description: "將整個名單順序完全打亂。",
    icon: "Shuffle"
  },
  [DrawType.SINGLE]: {
    type: DrawType.SINGLE,
    title: "經典單抽 (Single)",
    description: "萬中選一，抽出唯一的結果。",
    icon: "User"
  },
  [DrawType.PAIRING]: {
    type: DrawType.PAIRING,
    title: "配對/互抽 (Pairing)",
    description: "交換禮物必備，隨機兩兩配對。",
    icon: "Gift"
  },
  [DrawType.GIFT_LADDER]: {
    type: DrawType.GIFT_LADDER,
    title: "禮物爬梯 (Gift Ladder)",
    description: "輸入名單與禮物，透過爬梯遊戲決定歸屬！",
    icon: "AlignCenterVertical",
    requireDualInput: true
  },
  [DrawType.DAILY_FORTUNE]: {
    type: DrawType.DAILY_FORTUNE,
    title: "每日運勢 (Fortune)",
    description: "搖一搖籤筒，獲得今日運勢與幸運小物。",
    icon: "Dices",
    noInput: true
  },
  [DrawType.COUNTDOWN]: {
    type: DrawType.COUNTDOWN,
    title: "倒數揭曉 (Countdown)",
    description: "設定倒數計時，增加緊張儀式感。",
    icon: "Clock",
    requireTimer: true
  }
};

export const PLACEHOLDER_TEXT = `請輸入名單，每行一個。
例如：
Alice
Bob
Charlie
David`;

export const PLACEHOLDER_TEXT_GIFTS = `請輸入禮物清單，每行一個。
例如：
神秘小禮物
咖啡兌換券
高級筆記本
藍芽耳機`;

export const ICON_MAP: Record<string, any> = {
  Sparkles, Shuffle, User, Gift, Dices, Clock, AlignCenterVertical
};

// Data for Daily Fortune
export const FORTUNES = [
  { label: "大吉", desc: "運勢如虹，心想事成，適合展開新計畫。" },
  { label: "中吉", desc: "平穩向上，努力將有回報，保持樂觀。" },
  { label: "小吉", desc: "微小的幸福就在身邊，享受當下。" },
  { label: "吉", desc: "順順利利，平安是福，適合與朋友聚會。" },
  { label: "末吉", desc: "蓄勢待發，靜待時機，多充實自己。" },
];

export const LUCKY_ITEMS = [
  "熱美式咖啡", "多肉植物", "格紋筆記本", "帆布袋", "香氛蠟燭", 
  "復古墨鏡", "木質杯墊", "銀飾戒指", "詩集", "巧克力",
  "環保吸管", "護手霜", "拍立得", "耳罩式耳機", "維他命C"
];

export const LUCKY_COLORS = [
  { name: "迷霧灰 (Fog Grey)", hex: "#9EA8BC" },
  { name: "乾燥玫瑰 (Dusty Rose)", hex: "#D4C4C4" },
  { name: "鼠尾草綠 (Sage Green)", hex: "#8C9E9A" },
  { name: "燕麥奶 (Oatmeal)", hex: "#D9CDB8" },
  { name: "可可棕 (Cocoa)", hex: "#5E5045" },
  { name: "芥末黃 (Mustard)", hex: "#D4AF37" },
  { name: "灰藍 (Slate Blue)", hex: "#778899" },
  { name: "陶土紅 (Terracotta)", hex: "#E07A5F" },
];