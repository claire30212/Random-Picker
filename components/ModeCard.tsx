import React from 'react';
import { DrawConfig } from '../types';
import { ICON_MAP } from '../constants';

interface ModeCardProps {
  config: DrawConfig;
  onClick: () => void;
  isSpecial?: boolean;
}

const ModeCard: React.FC<ModeCardProps> = ({ config, onClick, isSpecial = false }) => {
  const Icon = ICON_MAP[config.icon];

  return (
    <div 
      onClick={onClick}
      className={`
        group relative overflow-hidden p-6 rounded-2xl cursor-pointer transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl border border-white/50
        ${isSpecial ? 'bg-gradient-to-br from-white to-morandi-pink/20' : 'bg-white'}
        shadow-sm hover:shadow-morandi-gray/20
      `}
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors
          ${isSpecial ? 'bg-morandi-pink text-white' : 'bg-morandi-base text-morandi-dark group-hover:bg-morandi-dark group-hover:text-morandi-base'}
        `}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-morandi-dark mb-1 group-hover:text-morandi-accent transition-colors">
            {config.title}
          </h3>
          <p className="text-sm text-morandi-gray leading-relaxed">
            {config.description}
          </p>
        </div>
      </div>

      {/* Decorative Circle */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-morandi-base/50 group-hover:scale-150 transition-transform duration-500 ease-in-out z-0" />
    </div>
  );
};

export default ModeCard;