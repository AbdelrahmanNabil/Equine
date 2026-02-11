
import React, { useState } from 'react';
import { Question } from '../types';

interface FlashcardProps {
  question: Question;
  onResponse: (mastered: boolean) => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ question, onResponse }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => setIsRevealed(true);

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      {/* Question Card */}
      <div 
        onClick={!isRevealed ? handleReveal : undefined}
        className={`bg-white rounded-3xl p-8 ios-card-shadow flex flex-col gap-8 transition-all duration-300 min-h-[360px] cursor-pointer ${!isRevealed ? 'active:opacity-80' : ''}`}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[12px] font-bold text-[#007AFF] tracking-wider uppercase">Question (DE)</span>
            <p className="text-xl font-semibold leading-snug">{question.question_de}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[12px] font-bold text-[#8E8E93] tracking-wider uppercase">Question (EN)</span>
            <p className="text-lg text-slate-600 leading-snug">{question.question_en}</p>
          </div>
        </div>

        {isRevealed ? (
          <div className="border-t border-slate-100 pt-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[12px] font-bold text-[#34C759] tracking-wider uppercase">Answer (DE)</span>
                <p className="text-[17px] text-slate-800 whitespace-pre-wrap leading-relaxed">{question.answer_de}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[12px] font-bold text-[#8E8E93] tracking-wider uppercase">Answer (EN)</span>
                <p className="text-[16px] text-slate-500 whitespace-pre-wrap leading-relaxed italic">{question.answer_en}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-auto flex justify-center py-6 border-2 border-dashed border-slate-100 rounded-2xl">
            <p className="text-slate-400 font-medium">Tap to reveal answer</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isRevealed && (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <button 
            onClick={() => onResponse(false)}
            className="bg-[#FF3B30] text-white rounded-2xl py-4 px-6 font-bold shadow-lg shadow-red-100 active:scale-95 transition-transform"
          >
            Needs Review
          </button>
          <button 
            onClick={() => onResponse(true)}
            className="bg-[#34C759] text-white rounded-2xl py-4 px-6 font-bold shadow-lg shadow-green-100 active:scale-95 transition-transform"
          >
            Got It
          </button>
        </div>
      )}
    </div>
  );
};
