import React, { useState } from 'react';
import { REVENUE_TERMS } from '../data/mockData';
import { HelpCircle, Info } from 'lucide-react';

interface Props {
  term: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export const RevenueTermTooltip: React.FC<Props> = ({ term, children, showIcon = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const data = REVENUE_TERMS[term] || {
    term,
    hindi: '',
    category: 'Revenue Term',
    definition: 'Traditional administrative land terminology under State Land Revenue Code.',
    example: '',
  };

  return (
    <span className="relative inline-flex items-center gap-1 group">
      <span
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="cursor-help border-b border-dotted border-slate-400 hover:border-slate-700 hover:text-slate-900 transition-colors"
      >
        {children || term}
      </span>

      {showIcon && (
        <HelpCircle
          className="w-3 h-3 text-slate-400 hover:text-slate-600 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      )}

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-900 text-white rounded-lg shadow-xl text-xs z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-xs">{data.term}</span>
              {data.hindi && <span className="text-amber-400 font-medium">({data.hindi})</span>}
            </div>
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">
              {data.category}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">{data.definition}</p>
          {data.example && (
            <p className="mt-1.5 text-[10px] text-slate-400 italic bg-slate-800/60 p-1.5 rounded">
              Eg: {data.example}
            </p>
          )}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </span>
  );
};
