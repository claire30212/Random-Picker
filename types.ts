export enum AppMode {
  HOME = 'HOME',
  INPUT = 'INPUT',
  PROCESS = 'PROCESS',
  RESULT = 'RESULT',
}

export enum DrawType {
  PICK_N = 'PICK_N',       // Pick X from N
  SHUFFLE = 'SHUFFLE',     // Random Sort
  SINGLE = 'SINGLE',       // Pick 1
  PAIRING = 'PAIRING',     // Secret Santa / Pairing
  GIFT_LADDER = 'GIFT_LADDER', // Amidakuji / Gift Game
  DAILY_FORTUNE = 'DAILY_FORTUNE', // Fortune Stick
  COUNTDOWN = 'COUNTDOWN', // Countdown then pick
}

export interface DrawConfig {
  type: DrawType;
  title: string;
  description: string;
  icon: string;
  requireCount?: boolean;
  requireTimer?: boolean;
  requireDualInput?: boolean; // For Gifts (People + Items)
  noInput?: boolean;          // For Fortune (System generated)
}

export interface DrawSettings {
  pickCount: number;
  timerSeconds: number;
}

export interface PairingResult {
  giver: string;
  receiver: string;
}

export interface FortuneResult {
  fortune: string;    // 大吉
  description: string; 
  luckyColor: string; // Hex
  luckyColorName: string;
  luckyItem: string;
}

// Union type for results to handle different structures
export type DrawResultData = string[] | PairingResult[] | FortuneResult; 

export interface DrawSession {
  id: string;
  timestamp: number;
  type: DrawType;
  inputList: string[];
  results: DrawResultData;
}