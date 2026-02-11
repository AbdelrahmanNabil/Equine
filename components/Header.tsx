
import React from 'react';

interface HeaderProps {
  current: number;
  total: number;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ current, total, onBack }) => {
  const progress = (current / total) * 100;

  return (
    <header className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 pt-12 pb-4 safe-top">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             {onBack && (
               <button onClick={onBack} className="text-[#007AFF] font-medium flex items-center gap-1 active:opacity-50">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                 Exit
               </button>
             )}
          </div>
          <span className="text-[14px] font-bold text-slate-400 tabular-nums">
            {current} / {total} Mastered
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#34C759] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
};
