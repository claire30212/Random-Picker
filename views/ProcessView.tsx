import React, { useEffect, useState, useRef } from 'react';
import { DrawType, PairingResult } from '../types';
import { shuffleArray } from '../utils';

interface ProcessViewProps {
  mode: DrawType;
  candidates: string[];
  gifts?: string[];
  timerSetting: number;
  onComplete: (results?: any) => void;
}

// Avatar class for Ladder Animation
class LadderAvatar {
  id: number;
  col: number;
  x: number;
  y: number;
  color: string;
  name: string;
  fullName: string;
  targetCol: number | null; 
  speed: number;
  finished: boolean;

  constructor(id: number, col: number, colWidth: number, padding: number, fullName: string) {
    this.id = id;
    this.col = col;
    this.x = padding + col * colWidth;
    this.y = padding;
    // Enhanced Palette for better visibility
    this.color = ['#E07A5F', '#D4AF37', '#8C9E9A', '#778899', '#5E5045', '#D4C4C4', '#2A9D8F', '#F4A261'][id % 8];
    this.fullName = fullName;
    this.name = fullName.substring(0, 1).toUpperCase();
    this.targetCol = null;
    this.speed = 2 + Math.random(); // Faster speed: 2-3px per frame
    this.finished = false;
  }
}

const ProcessView: React.FC<ProcessViewProps> = ({ mode, candidates, gifts, timerSetting, onComplete }) => {
  const [displayValue, setDisplayValue] = useState<string>("Ready...");
  const [countdown, setCountdown] = useState(timerSetting);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    let interval: any;
    
    // --- MODE: COUNTDOWN ---
    if (mode === DrawType.COUNTDOWN) {
      setDisplayValue(countdown.toString());
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } 
    // --- MODE: GIFT LADDER (Visualizer) ---
    else if (mode === DrawType.GIFT_LADDER) {
      const isSmallGroup = candidates.length <= 8;
      
      if (isSmallGroup && canvasRef.current) {
         const cleanup = startLadderGame(canvasRef.current, candidates, gifts || [], onComplete);
         return () => cleanup();
      } else {
        // Fallback for large groups
        const texts = ["佈置梯子...", "連接命運...", "爬梯中...", "即將揭曉!"];
        let idx = 0;
        interval = setInterval(() => {
           setDisplayValue(texts[idx % texts.length]);
           idx++;
        }, 800);

        setTimeout(() => {
          clearInterval(interval);
          onComplete();
        }, 3500);
      }
    }
    // --- MODE: DAILY FORTUNE ---
    else if (mode === DrawType.DAILY_FORTUNE) {
      const texts = ["搖動籤筒...", "感應氣場...", "凝神祈願...", "籤詩掉落..."];
      let idx = 0;
      interval = setInterval(() => {
         setDisplayValue(texts[idx % texts.length]);
         idx++;
      }, 600);
      
      setTimeout(() => {
        clearInterval(interval);
        onComplete();
      }, 2400);
    }
    // --- MODE: STANDARD ROLLING ---
    else {
      const duration = 2000; 
      const speed = 80;
      let elapsed = 0;

      interval = setInterval(() => {
        const randomName = candidates[Math.floor(Math.random() * candidates.length)];
        setDisplayValue(randomName);
        elapsed += speed;

        if (elapsed >= duration) {
          clearInterval(interval);
          onComplete();
        }
      }, speed);
    }

    return () => clearInterval(interval);
  }, [mode, candidates, gifts, timerSetting, onComplete]);

  // Update display for Countdown
  useEffect(() => {
    if (mode === DrawType.COUNTDOWN) {
      setDisplayValue(countdown > 0 ? countdown.toString() : "0");
    }
  }, [countdown, mode]);

  // --- LADDER GAME LOGIC ---
  const startLadderGame = (
    canvas: HTMLCanvasElement, 
    people: string[], 
    rawGifts: string[], 
    onFinish: (res: any) => void
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};

    const count = people.length;
    // Normalize Gifts (loop or cut to match people count)
    let displayGifts = [...rawGifts];
    if (displayGifts.length === 0) displayGifts = ["Gift"]; // Fallback
    while (displayGifts.length < count) {
      displayGifts = [...displayGifts, ...rawGifts];
    }
    // Shuffle gifts once to place them randomly at the bottom
    displayGifts = shuffleArray(displayGifts).slice(0, count);

    const padding = 40;
    const w = canvas.width;
    const h = canvas.height;
    const colWidth = (w - padding * 2) / (count - 1);
    const ladderHeight = h - padding * 2 - 30; // Reserve space for text at bottom
    const startY = padding;
    const endY = startY + ladderHeight;

    // 1. Generate Bridges
    const bridges: { col: number, y: number }[] = [];
    const bridgeCount = count * 4; 
    for (let i = 0; i < bridgeCount; i++) {
      const col = Math.floor(Math.random() * (count - 1));
      const y = startY + 30 + Math.random() * (ladderHeight - 60);
      const tooClose = bridges.some(b => Math.abs(b.y - y) < 20);
      if (!tooClose) {
        bridges.push({ col, y });
      }
    }
    bridges.sort((a, b) => a.y - b.y);

    // 2. Create Avatars
    const avatars = people.map((name, i) => new LadderAvatar(i, i, colWidth, padding, name));
    
    // Animation Loop
    let animationId: number;
    let finishedCount = 0;
    const results: PairingResult[] = [];

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw Ladder Structure
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#D9CDB8'; 

      // Verticals
      for (let i = 0; i < count; i++) {
        const x = padding + i * colWidth;
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();

        // Draw Gift at bottom
        ctx.fillStyle = '#5E5045';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const giftName = displayGifts[i];
        // Truncate if too long for display
        const displayGift = giftName.length > 4 ? giftName.substring(0, 4) + '..' : giftName;
        ctx.fillText(displayGift, x, endY + 10);
      }

      // Bridges
      ctx.strokeStyle = '#9EA8BC'; 
      bridges.forEach(b => {
        const x1 = padding + b.col * colWidth;
        const x2 = padding + (b.col + 1) * colWidth;
        ctx.beginPath();
        ctx.moveTo(x1, b.y);
        ctx.lineTo(x2, b.y);
        ctx.stroke();
      });

      // Update & Draw Avatars
      finishedCount = 0;
      avatars.forEach(avatar => {
        if (avatar.finished) {
          // Draw at bottom
          ctx.fillStyle = avatar.color;
          ctx.beginPath();
          ctx.arc(avatar.x, endY, 10, 0, Math.PI * 2);
          ctx.fill();
          finishedCount++;
          return;
        }

        // Draw Avatar
        ctx.fillStyle = avatar.color;
        ctx.beginPath();
        ctx.arc(avatar.x, avatar.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(avatar.name, avatar.x, avatar.y);

        // Movement Logic
        if (avatar.y >= endY) {
          avatar.finished = true;
          avatar.y = endY;
          // Record Result
          // Avatar is at avatar.col (which corresponds to displayGifts[avatar.col])
          results.push({
            giver: avatar.fullName,
            receiver: displayGifts[avatar.col]
          });
          return;
        }

        if (avatar.targetCol !== null) {
          // Horizontal Movement
          const targetX = padding + avatar.targetCol * colWidth;
          const dx = targetX - avatar.x;
          
          if (Math.abs(dx) < 3) { // Snap threshold
            avatar.x = targetX;
            avatar.col = avatar.targetCol;
            avatar.targetCol = null;
            avatar.y += 3; // CRITICAL FIX: Push down past bridge to avoid re-trigger
          } else {
            avatar.x += Math.sign(dx) * avatar.speed;
          }
        } else {
          // Vertical Movement
          const nextY = avatar.y + avatar.speed;
          
          // Check for bridge intersection
          // Find the FIRST bridge we hit between current y and next y
          const hitBridge = bridges.find(b => {
            const isMyBridge = (b.col === avatar.col) || (b.col === avatar.col - 1);
            // Strict check: bridge must be strictly below current Y (or equal if we just started frame) 
            // AND within reach of nextY
            return isMyBridge && b.y >= avatar.y && b.y <= nextY;
          });

          if (hitBridge) {
            avatar.y = hitBridge.y; 
            if (hitBridge.col === avatar.col) {
              avatar.targetCol = avatar.col + 1; // Right
            } else {
              avatar.targetCol = avatar.col - 1; // Left
            }
          } else {
            avatar.y = nextY;
          }
        }
      });

      if (finishedCount < count) {
        animationId = requestAnimationFrame(render);
      } else {
        setTimeout(() => onFinish(results), 500);
      }
    };

    render();

    return () => cancelAnimationFrame(animationId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in text-center overflow-hidden w-full">
      
      {/* Visual Container */}
      <div className="mb-8 relative flex justify-center items-center w-full">
        
        {/* Spinner for Standard Modes */}
        {mode !== DrawType.GIFT_LADDER && mode !== DrawType.DAILY_FORTUNE && (
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-morandi-accent border-t-transparent animate-spin opacity-50" />
        )}

        {/* Cylinder for Fortune */}
        {mode === DrawType.DAILY_FORTUNE && (
           <div className="relative animate-pulse-slow">
              <div className="w-20 h-32 bg-morandi-sand border-4 border-morandi-dark rounded-xl relative overflow-hidden flex items-center justify-center rotate-12 animate-bounce shadow-lg">
                 <div className="text-4xl text-morandi-dark font-serif writing-vertical-rl">運</div>
              </div>
           </div>
        )}

        {/* Ladder Canvas for Gift Mode (Small N) */}
        {mode === DrawType.GIFT_LADDER && candidates.length <= 8 && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-morandi-base/50">
            <canvas 
              ref={canvasRef} 
              width={Math.min(window.innerWidth - 40, 600)} 
              height={360} 
              className="rounded bg-morandi-base/10"
            />
          </div>
        )}
        
        {/* Gift Box for Gift Mode (Large N) */}
        {mode === DrawType.GIFT_LADDER && candidates.length > 8 && (
           <div className="text-8xl animate-bounce drop-shadow-xl">🎁</div>
        )}
      </div>

      <div className="space-y-4 relative z-10 px-4">
        {mode !== DrawType.GIFT_LADDER && (
          <p className="text-morandi-gray tracking-[0.2em] uppercase text-sm animate-pulse-slow">
             {mode === DrawType.DAILY_FORTUNE ? 'Consulting the Oracle...' : 'Selecting...'}
          </p>
        )}
        
        <h1 className={`
          font-serif font-bold text-morandi-dark
          transition-all duration-100
          ${mode === DrawType.COUNTDOWN ? 'text-8xl md:text-9xl' : 'text-3xl md:text-5xl'}
          ${mode === DrawType.GIFT_LADDER ? 'text-lg md:text-xl text-morandi-gray' : ''}
        `}>
          {displayValue}
        </h1>
      </div>
    </div>
  );
};

export default ProcessView;