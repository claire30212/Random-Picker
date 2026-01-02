import React, { useRef, useState } from 'react';
import { DrawType, PairingResult, DrawResultData, FortuneResult } from '../types';
import { DRAW_MODES } from '../constants';
import Button from '../components/Button';
import { Download, Copy, Share2, RotateCcw, Check, Sparkles, Gift } from 'lucide-react';
import { downloadElementAsImage, copyToClipboard } from '../utils';

interface ResultViewProps {
  mode: DrawType;
  results: DrawResultData;
  onRestart: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ mode, results, onRestart }) => {
  const config = DRAW_MODES[mode];
  const resultRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const isPairing = mode === DrawType.PAIRING;
  const isLadder = mode === DrawType.GIFT_LADDER;
  const isFortune = mode === DrawType.DAILY_FORTUNE;
  
  // Format data for display
  const renderContent = () => {
    if (isFortune) {
      const res = results as FortuneResult;
      return (
        <div className="flex flex-col items-center space-y-6 py-4">
           {/* Fortune Label */}
           <div className="relative">
             <div className="absolute inset-0 bg-morandi-accent blur-xl opacity-20 rounded-full"></div>
             <div className="relative w-32 h-32 md:w-40 md:h-40 bg-morandi-dark text-morandi-base rounded-full flex items-center justify-center shadow-xl border-4 border-double border-morandi-sand">
               <span className="text-5xl md:text-6xl font-serif font-bold tracking-widest writing-vertical-rl">{res.fortune}</span>
             </div>
           </div>

           {/* Description */}
           <p className="text-lg text-morandi-dark font-medium max-w-sm text-center leading-relaxed">
             {res.description}
           </p>

           <div className="w-full h-px bg-morandi-gray/20 my-2" />

           {/* Lucky Items */}
           <div className="flex gap-4 w-full justify-center">
              <div className="flex-1 bg-white p-4 rounded-xl border border-morandi-gray/10 flex flex-col items-center gap-2 shadow-sm">
                 <span className="text-xs text-morandi-gray uppercase tracking-wider">Lucky Color</span>
                 <div className="w-8 h-8 rounded-full shadow-md border border-white" style={{backgroundColor: res.luckyColor}} />
                 <span className="text-sm font-bold text-morandi-dark">{res.luckyColorName}</span>
              </div>
              <div className="flex-1 bg-white p-4 rounded-xl border border-morandi-gray/10 flex flex-col items-center gap-2 shadow-sm">
                 <span className="text-xs text-morandi-gray uppercase tracking-wider">Lucky Item</span>
                 <Sparkles className="text-morandi-accent" size={24} />
                 <span className="text-sm font-bold text-morandi-dark">{res.luckyItem}</span>
              </div>
           </div>
        </div>
      );
    } 
    else if (isPairing || isLadder) {
      return (results as PairingResult[]).map((pair, idx) => (
        <div key={idx} className="flex items-center justify-between p-3 border-b border-morandi-gray/10 last:border-0 animate-slide-up" style={{animationDelay: `${idx * 0.05}s`}}>
          <div className="flex items-center gap-2">
             <span className="w-6 h-6 rounded-full bg-morandi-base text-morandi-gray text-xs flex items-center justify-center">{idx + 1}</span>
             <span className="font-medium text-morandi-dark">{pair.giver}</span>
          </div>
          <div className="flex items-center gap-2 text-morandi-accent">
            {isLadder ? <Gift size={16} /> : <span>➔</span>}
          </div>
          <span className="font-medium text-morandi-dark text-right">{pair.receiver}</span>
        </div>
      ));
    } 
    else {
      return (results as string[]).map((item, idx) => (
        <div key={idx} className="flex items-center gap-4 p-3 border-b border-morandi-gray/10 last:border-0 animate-slide-up" style={{animationDelay: `${idx * 0.05}s`}}>
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-morandi-sand text-morandi-dark flex items-center justify-center font-bold text-sm font-serif">
            {idx + 1}
          </span>
          <span className="text-xl font-medium text-morandi-dark">{item}</span>
        </div>
      ));
    }
  };

  const handleDownload = () => {
    downloadElementAsImage('result-certificate', `result-${mode}-${Date.now()}`);
  };

  const handleCopy = () => {
    let text = "";
    if (isFortune) {
      const res = results as FortuneResult;
      text = `【今日運勢：${res.fortune}】\n${res.description}\n幸運色：${res.luckyColorName}\n幸運物：${res.luckyItem}`;
    } else if (isPairing || isLadder) {
      text = (results as PairingResult[]).map(p => `${p.giver} -> ${p.receiver}`).join('\n');
    } else {
      text = (results as string[]).join('\n');
    }
    copyToClipboard(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Generate a share link (simulated)
  const handleShare = () => {
    // Only share basic text modes via URL to avoid huge URLs. 
    // For fortune, we can share.
    const data = btoa(encodeURIComponent(JSON.stringify({ mode, results })));
    const url = `${window.location.origin}${window.location.pathname}#share=${data}`;
    copyToClipboard(url).then(() => alert("結果連結已複製到剪貼簿！"));
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto animate-fade-in">
      
      {/* Action Bar */}
      <div className="flex flex-wrap gap-3 justify-center md:justify-end">
        <Button variant="ghost" size="sm" onClick={handleShare}>
           <Share2 size={16} /> 分享結果
        </Button>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
           {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "已複製" : "複製文字"}
        </Button>
        <Button variant="secondary" size="sm" onClick={handleDownload}>
           <Download size={16} /> 下載圖片
        </Button>
      </div>

      {/* The Certificate Card (Visible & used for screenshot) */}
      <div 
        id="result-certificate" 
        ref={resultRef}
        className="bg-white p-8 md:p-12 rounded-none md:rounded-3xl shadow-2xl relative overflow-hidden text-center border-t-8 border-morandi-accent"
      >
        {/* Watermark/Logo for image */}
        <div className="absolute top-6 left-6 flex items-center gap-2 opacity-50">
           <Sparkles size={16} className="text-morandi-accent" />
           <span className="text-xs font-bold tracking-widest text-morandi-dark uppercase">Random Picker</span>
        </div>

        <div className="absolute top-6 right-6 text-xs text-morandi-gray font-mono">
          {new Date().toLocaleString('zh-TW', { hour12: false })}
        </div>

        <div className="mt-8 mb-8">
           <h2 className="text-3xl font-serif font-bold text-morandi-dark mb-2">{config.title}</h2>
           <div className="h-1 w-20 bg-morandi-accent mx-auto rounded-full"/>
           <p className="mt-4 text-morandi-gray">
             {isFortune ? '今日專屬指引' : '公正抽籤結果證明'}
           </p>
        </div>

        <div className={`bg-morandi-base/30 rounded-xl p-6 text-left max-h-[60vh] overflow-y-auto custom-scrollbar border border-morandi-base ${isFortune ? 'flex justify-center' : ''}`}>
          {renderContent()}
        </div>

        <div className="mt-8 pt-8 border-t border-morandi-gray/10 flex justify-center items-center gap-2">
            <span className="text-morandi-accent text-lg">★</span>
            <span className="font-serif italic text-morandi-gray">
              {isFortune ? 'Good Luck' : 'Congratulations'}
            </span>
            <span className="text-morandi-accent text-lg">★</span>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button onClick={onRestart} size="lg" className="px-12 shadow-xl shadow-morandi-green/20">
          <RotateCcw size={20} /> {isFortune ? '再抽一次' : '回到設定'}
        </Button>
      </div>
    </div>
  );
};

export default ResultView;