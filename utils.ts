import { DrawType, PairingResult, FortuneResult } from './types';
import { FORTUNES, LUCKY_ITEMS, LUCKY_COLORS } from './constants';
import html2canvas from 'html2canvas';

export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// Simple derangement (Secret Santa) logic
export const generatePairings = (names: string[]): PairingResult[] => {
  if (names.length < 2) return [];
  
  let givers = shuffleArray(names);
  let receivers = shuffleArray(names);
  let isValid = false;
  let attempts = 0;

  while (!isValid && attempts < 100) {
    receivers = shuffleArray(names);
    isValid = true;
    for (let i = 0; i < givers.length; i++) {
      if (givers[i] === receivers[i]) {
        isValid = false;
        break;
      }
    }
    attempts++;
  }

  if (!isValid) {
    receivers = [...givers.slice(1), givers[0]];
  }

  return givers.map((giver, i) => ({
    giver,
    receiver: receivers[i]
  }));
};

// Generate Ladder Permutation
// This simulates the result of a ladder game
export const generateLadderResults = (people: string[], gifts: string[]): PairingResult[] => {
  if (people.length === 0 || gifts.length === 0) return [];
  
  // Normalize gifts list length to match people
  let extendedGifts = [...gifts];
  while (extendedGifts.length < people.length) {
    extendedGifts = [...extendedGifts, ...gifts];
  }
  // If too many gifts, shuffle and slice
  extendedGifts = shuffleArray(extendedGifts).slice(0, people.length);

  // In a real ladder, the mapping is a permutation.
  // We simulate this by just shuffling the gifts against the people.
  // The visualizer in ProcessView will generate a ladder that leads to this result.
  const finalGifts = shuffleArray(extendedGifts);
  
  return people.map((person, i) => ({
    giver: person, // In this context, giver is the participant
    receiver: finalGifts[i] // receiver is the gift
  }));
};

export const generateFortune = (): FortuneResult => {
  const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
  const item = LUCKY_ITEMS[Math.floor(Math.random() * LUCKY_ITEMS.length)];
  const color = LUCKY_COLORS[Math.floor(Math.random() * LUCKY_COLORS.length)];

  return {
    fortune: fortune.label,
    description: fortune.desc,
    luckyColor: color.hex,
    luckyColorName: color.name,
    luckyItem: item
  };
};

export const performDraw = (
  type: DrawType, 
  list: string[], 
  count: number = 1,
  listB: string[] = [] // Optional second list for gifts
): any => { // Return type loose to accommodate new types
  const cleanList = list.filter(item => item.trim() !== '');
  const cleanListB = listB.filter(item => item.trim() !== '');
  
  switch (type) {
    case DrawType.SINGLE:
    case DrawType.COUNTDOWN: {
      const shuffled = shuffleArray(cleanList);
      return [shuffled[0]];
    }
    case DrawType.PICK_N: {
      const shuffled = shuffleArray(cleanList);
      return shuffled.slice(0, Math.min(count, cleanList.length));
    }
    case DrawType.SHUFFLE: {
      return shuffleArray(cleanList);
    }
    case DrawType.PAIRING: {
      return generatePairings(cleanList);
    }
    case DrawType.GIFT_LADDER: {
      return generateLadderResults(cleanList, cleanListB);
    }
    case DrawType.DAILY_FORTUNE: {
      return generateFortune();
    }
    default:
      return cleanList;
  }
};

export const downloadElementAsImage = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2, 
      backgroundColor: null, 
      useCORS: true,
      logging: false,
    });
    
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error("Image generation failed", err);
    alert("圖片生成失敗，請稍後再試。");
  }
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
};