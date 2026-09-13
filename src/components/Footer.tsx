import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-3 mt-auto text-xs text-slate-500">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">Bhoomi Setu</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">Intelligent Land Record Digitization System</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
          <span>Engineered for Sovereign Cadastre Integrity</span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 text-slate-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            SHA-256 Verified Ledger
          </span>
        </div>
      </div>
    </footer>
  );
};
