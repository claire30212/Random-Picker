import React from 'react';
import { DrawType } from '../types';
import { DRAW_MODES } from '../constants';
import ModeCard from '../components/ModeCard';
import { Dices, Sparkles } from 'lucide-react';

interface HomeViewProps {
  onSelectMode: (type: DrawType) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onSelectMode }) => {
  const basicModes = [DrawType.PICK_N, DrawType.SHUFFLE, DrawType.SINGLE];
  const interactiveModes = [DrawType.PAIRING, DrawType.GIFT_LADDER, DrawType.COUNTDOWN];
  const fortuneConfig = DRAW_MODES[DrawType.DAILY_FORTUNE];

  return (
    <div className="space-y-16 animate-fade-in pb-12">
      {/* Intro Hero */}
      <div className="text-center space-y-4 pt-4">
        <h2 className="text-3xl md:text-5xl font-serif text-morandi-dark tracking-tight">
          Start Your Draw
        </h2>
        <p className="text-morandi-gray max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          選擇一個模式開始您的隨機之旅。
          <br />優雅的配色，流暢的動畫，為每一次的選擇增添儀式感。
        </p>
      </div>

      {/* Grid Container */}
      <div className="space-y-12">
        {/* Section 1: Essentials */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 opacity-70">
            <div className="h-px bg-morandi-dark/20 flex-grow" />
            <span className="text-xs font-bold tracking-[0.2em] text-morandi-gray uppercase">核心功能 Essentials</span>
            <div className="h-px bg-morandi-dark/20 flex-grow" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {basicModes.map(mode => (
              <ModeCard 
                key={mode} 
                config={DRAW_MODES[mode]} 
                onClick={() => onSelectMode(mode)} 
              />
            ))}
          </div>
        </div>

        {/* Section 2: Interactive */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 opacity-70">
            <div className="h-px bg-morandi-dark/20 flex-grow" />
            <span className="text-xs font-bold tracking-[0.2em] text-morandi-gray uppercase">互動遊戲 Interactive</span>
            <div className="h-px bg-morandi-dark/20 flex-grow" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interactiveModes.map(mode => (
              <ModeCard 
                key={mode} 
                config={DRAW_MODES[mode]} 
                onClick={() => onSelectMode(mode)}
                isSpecial
              />
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Daily Fortune (Special Bottom Section) */}
      <div className="mt-20 relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
           <div className="w-full border-t border-morandi-gray/10"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#F5F2EA] px-4 text-morandi-gray/50">
            <Sparkles size={16} />
          </span>
        </div>

        <div className="mt-8 flex justify-center">
          <div 
            onClick={() => onSelectMode(DrawType.DAILY_FORTUNE)}
            className="group cursor-pointer relative w-full max-w-md bg-white rounded-3xl p-8 shadow-xl shadow-morandi-sand/30 border border-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-morandi-accent/10 overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-morandi-sand/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-morandi-green/10 rounded-full -ml-12 -mb-12 transition-transform group-hover:scale-150 duration-700" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-morandi-accent/10 text-morandi-accent rounded-2xl flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform duration-300">
                <Dices size={32} />
              </div>
              
              <h3 className="text-2xl font-serif font-bold text-morandi-dark">
                {fortuneConfig.title}
              </h3>
              
              <p className="text-morandi-gray text-sm px-4 leading-relaxed">
                {fortuneConfig.description}
                <br />
                <span className="text-xs opacity-70 mt-2 block">
                  Click to shake the fortune cylinder
                </span>
              </p>

              <button className="mt-4 px-8 py-2 rounded-full border border-morandi-accent text-morandi-accent text-sm font-medium hover:bg-morandi-accent hover:text-white transition-colors">
                抽取今日運勢
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;