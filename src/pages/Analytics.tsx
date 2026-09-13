import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  Cpu, 
  Clock, 
  UserCheck,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Analytics: React.FC = () => {
  const { stats } = useApp();

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            EXECUTIVE ANALYTICS • DISTRICT INTELLIGENCE
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Digitization Metrics & Quality Assessment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time throughput, script-specific Indic-HTR model accuracy, common disparity classifications, and officer turnaround SLA.
          </p>
        </div>

        <button
          onClick={() => alert('Generating Executive Cadastral Performance Report (PDF)...')}
          className="px-3.5 py-1.5 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* 4 High-Level Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            AVERAGE ADJUDICATION TIME
          </span>
          <div className="text-3xl font-bold text-slate-900 mt-2">1.8 min</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>64% faster than manual registry</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            STRAIGHT-THROUGH AUTO-VERIFY
          </span>
          <div className="text-3xl font-bold text-slate-900 mt-2">58.4%</div>
          <div className="text-[11px] text-slate-500 mt-1">Zero human touch required</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            COMPOSITE INDIC-HTR SCORE
          </span>
          <div className="text-3xl font-bold text-purple-900 mt-2">96.4%</div>
          <div className="text-[11px] text-purple-700 font-medium mt-1">Dual CRNN + ViT Architecture</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            CADASTRAL PARCELS SEALED
          </span>
          <div className="text-3xl font-bold text-emerald-900 mt-2">876</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">100% Cryptographically bound</div>
        </div>

      </div>

      {/* Script-Specific Accuracy & Error Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Script & Language Recognition Accuracy */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Indic-HTR Model Precision by Archival Script
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Benchmark: N-1000</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { script: 'Hindi (Devanagari Standard Registers)', accuracy: 98.4, sample: '620 docs' },
              { script: 'Urdu (Nastaliq & Shikasta Cursive)', accuracy: 93.8, sample: '310 docs' },
              { script: 'English (Settlement Surveys & Grants)', accuracy: 99.2, sample: '180 docs' },
              { script: 'Kaithi / Modi Historical Land Deeds', accuracy: 89.6, sample: '138 docs' },
            ].map((item) => (
              <div key={item.script} className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-800">{item.script}</span>
                  <div className="space-y-0 text-right">
                    <span className="font-mono font-bold text-slate-900">{item.accuracy}%</span>
                    <span className="text-[10px] text-slate-400 block">{item.sample}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#0f172a] h-2 rounded-full"
                    style={{ width: `${item.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Validation Discrepancy Breakdown */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Discrepancy Category Breakdown
            </h2>
            <span className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-semibold">
              142 Flagged Total
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { label: 'Area Numeral Ink Smudge / Ambiguity', count: 64, pct: 45 },
              { label: 'Duplicate Khasra Candidate in Adjacent Khata', count: 38, pct: 27 },
              { label: 'Owner Parentage Spelling Discrepancy', count: 24, pct: 17 },
              { label: 'Unclosed Cadastral Boundary Polygon (>0.05m)', count: 16, pct: 11 },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-700 font-medium">{item.label}</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {item.count} ({item.pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-red-700 h-2 rounded-full"
                    style={{ width: `${item.pct * 2}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
