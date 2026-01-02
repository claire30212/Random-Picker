import React, { useState, useRef } from 'react';
import { DrawType } from '../types';
import { DRAW_MODES, PLACEHOLDER_TEXT, PLACEHOLDER_TEXT_GIFTS } from '../constants';
import Button from '../components/Button';
import { Upload, FileText, X, ArrowRight, Gift } from 'lucide-react';

interface InputViewProps {
  mode: DrawType;
  onSubmit: (list: string[], count: number, timer: number, listB?: string[]) => void;
  onBack: () => void;
}

const InputView: React.FC<InputViewProps> = ({ mode, onSubmit, onBack }) => {
  const config = DRAW_MODES[mode];
  const [inputText, setInputText] = useState('');
  const [inputTextB, setInputTextB] = useState(''); // For Gifts
  const [pickCount, setPickCount] = useState(1);
  const [timer, setTimer] = useState(5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getList = (text: string) => text.split('\n').map(s => s.trim()).filter(s => s !== '');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setInputText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleStart = () => {
    if (config.noInput) {
      onSubmit([], 1, 3); // Dummy data for fortune
      return;
    }

    const list = getList(inputText);
    const listB = config.requireDualInput ? getList(inputTextB) : [];

    if (list.length === 0) {
      alert("請至少輸入一個名單項目！");
      return;
    }
    
    if (config.requireDualInput && listB.length === 0) {
      alert("請至少輸入一個禮物項目！");
      return;
    }

    if (config.requireCount && pickCount > list.length) {
      alert(`名單數量 (${list.length}) 少於欲抽出數量 (${pickCount})`);
      return;
    }
    onSubmit(list, pickCount, timer, listB);
  };

  const currentCount = getList(inputText).length;
  const currentCountB = getList(inputTextB).length;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-morandi-gray/10 animate-slide-up border border-morandi-base max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
           <button 
             onClick={onBack} 
             className="w-10 h-10 rounded-full bg-morandi-base flex items-center justify-center text-morandi-gray hover:bg-morandi-dark hover:text-white transition-all"
           >
             <X size={20} />
           </button>
           <div>
              <h2 className="text-2xl font-serif font-bold text-morandi-dark">
                {config.title}
              </h2>
              {!config.noInput && (
                 <p className="text-xs text-morandi-gray mt-1">
                   {config.requireDualInput ? '請輸入雙方資料以進行配對' : '請輸入候選名單'}
                 </p>
              )}
           </div>
        </div>
        
        {!config.noInput && (
          <span className="text-sm font-medium bg-morandi-base px-4 py-2 rounded-lg text-morandi-dark">
            {config.requireDualInput ? `人數: ${currentCount} / 禮物: ${currentCountB}` : `目前項目: ${currentCount}`}
          </span>
        )}
      </div>

      <div className={`grid grid-cols-1 ${config.noInput ? 'md:grid-cols-1' : 'md:grid-cols-3'} gap-8`}>
        {/* Left Column: Input Area */}
        {!config.noInput && (
          <div className="md:col-span-2 space-y-6">
            
            {/* Primary Input */}
            <div className="relative group">
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-sm font-bold text-morandi-dark flex items-center gap-2">
                  <div className="w-1 h-4 bg-morandi-dark rounded-full"/>
                  {config.requireDualInput ? '參加者名單' : '抽籤名單'}
                </label>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-xs text-morandi-gray hover:text-morandi-accent transition-colors cursor-pointer"
                >
                  <Upload size={12} /> 匯入檔案
                </button>
                <input type="file" ref={fileInputRef} accept=".txt,.csv" className="hidden" onChange={handleFileUpload} />
              </div>
              
              <textarea
                className="w-full h-64 p-5 bg-morandi-base/20 border border-morandi-gray/20 rounded-2xl focus:ring-2 focus:ring-morandi-green/50 focus:border-morandi-green outline-none resize-none font-mono text-morandi-dark placeholder:text-morandi-gray/40 transition-all text-sm leading-relaxed custom-scrollbar shadow-inner"
                placeholder={PLACEHOLDER_TEXT}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>

            {/* Secondary Input for Gifts */}
            {config.requireDualInput && (
              <div className="relative animate-fade-in group">
                 <div className="flex items-center mb-2 px-1">
                    <label className="text-sm font-bold text-morandi-dark flex items-center gap-2">
                       <Gift size={16} className="text-morandi-accent"/>
                       <div className="w-1 h-4 bg-morandi-accent rounded-full"/>
                       禮物清單
                    </label>
                 </div>
                <textarea
                  className="w-full h-40 p-5 bg-morandi-base/20 border border-morandi-gray/20 rounded-2xl focus:ring-2 focus:ring-morandi-accent/50 focus:border-morandi-accent outline-none resize-none font-mono text-morandi-dark placeholder:text-morandi-gray/40 transition-all text-sm leading-relaxed custom-scrollbar shadow-inner"
                  placeholder={PLACEHOLDER_TEXT_GIFTS}
                  value={inputTextB}
                  onChange={(e) => setInputTextB(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {/* Fortune Mode Description */}
        {config.noInput && (
          <div className="text-center py-12 px-4">
             <div className="w-24 h-24 bg-morandi-base rounded-full mx-auto flex items-center justify-center mb-6 text-morandi-dark">
               <Gift size={40} />
             </div>
             <h3 className="text-xl font-bold text-morandi-dark mb-2">準備好接收今日運勢了嗎？</h3>
             <p className="text-morandi-gray">
               系統將隨機為您抽取一張靈籤，並搭配今日的幸運顏色與小物。<br/>
               心誠則靈，準備好就點擊開始吧！
             </p>
          </div>
        )}

        {/* Right Column: Settings */}
        <div className="md:col-span-1 space-y-6 flex flex-col h-full">
          
          {(!config.noInput && !config.requireDualInput) && (
            <div className="bg-morandi-base/30 p-6 rounded-2xl space-y-6 border border-morandi-base">
              <h3 className="font-bold text-morandi-dark flex items-center gap-2 pb-2 border-b border-morandi-dark/10">
                <FileText size={18} /> 詳細設定
              </h3>

              {config.requireCount && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-morandi-gray">抽出數量</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      min="1" 
                      max={Math.max(1, currentCount)}
                      value={pickCount}
                      onChange={(e) => setPickCount(parseInt(e.target.value) || 1)}
                      className="w-full p-4 rounded-xl border border-morandi-gray/20 bg-white text-center font-bold text-xl text-morandi-dark focus:outline-none focus:border-morandi-green shadow-sm"
                    />
                  </div>
                </div>
              )}

              {config.requireTimer && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-morandi-gray">倒數秒數</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 5, 10].map(sec => (
                      <button
                        key={sec}
                        onClick={() => setTimer(sec)}
                        className={`py-2 text-sm rounded-lg border transition-all font-medium ${timer === sec ? 'bg-morandi-green text-white border-morandi-green shadow-md' : 'bg-white text-morandi-gray border-morandi-gray/20 hover:border-morandi-green'}`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!config.requireCount && !config.requireTimer && (
                <p className="text-sm text-morandi-gray italic bg-white/50 p-4 rounded-xl">
                  此模式無需額外設定，系統將自動處理。
                </p>
              )}
            </div>
          )}

          <div className="mt-auto pt-8">
            <Button 
              fullWidth 
              size="lg" 
              onClick={handleStart}
              disabled={!config.noInput && currentCount === 0}
              className="group py-4 text-lg shadow-xl shadow-morandi-dark/10"
            >
              {config.noInput ? '抽取運勢' : '開始抽籤'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputView;