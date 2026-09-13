import React, { useState } from 'react';
import { GisParcel } from '../types';
import { GIS_PARCELS } from '../data/mockData';
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  CheckCircle2,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  selectedParcelId?: string;
  onSelectParcel?: (parcel: GisParcel) => void;
  compact?: boolean;
}

export const CadastralMap: React.FC<Props> = ({ 
  selectedParcelId = 'P-124-2', 
  onSelectParcel,
  compact = false 
}) => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string>(selectedParcelId);
  const [mapLayer, setMapLayer] = useState<'cadastre' | 'satellite' | 'hybrid'>('cadastre');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeParcel = GIS_PARCELS.find((p) => p.id === activeId) || GIS_PARCELS[1];

  const handleSelect = (parcel: GisParcel) => {
    setActiveId(parcel.id);
    if (onSelectParcel) onSelectParcel(parcel);
  };

  const filteredParcels = GIS_PARCELS.filter(
    (p) => 
      p.khasraNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#0b1329] rounded-xl border border-slate-700/80 overflow-hidden text-white relative shadow-lg">
      
      {/* Map Header Overlay */}
      <div className="flex items-center justify-between p-3 bg-slate-900/90 border-b border-slate-700/80 text-xs backdrop-blur-xs z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-wide text-sky-400">
            <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span>Tehsil: Alipur (07)</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-[11px] font-mono text-slate-300 hidden sm:inline">
            28.7041° N, 77.1025° E
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
            GIS CRS: EPSG:3857
          </span>
        </div>

        {/* Layer Controls */}
        <div className="flex items-center gap-1.5">
          <div className="bg-slate-800 p-0.5 rounded border border-slate-700 flex text-[11px]">
            <button
              onClick={() => setMapLayer('cadastre')}
              className={`px-2 py-0.5 rounded ${mapLayer === 'cadastre' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Cadastral
            </button>
            <button
              onClick={() => setMapLayer('hybrid')}
              className={`px-2 py-0.5 rounded ${mapLayer === 'hybrid' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Hybrid
            </button>
          </div>

          <div className="flex items-center bg-slate-800 border border-slate-700 rounded p-0.5">
            <button 
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.6))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.8))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Canvas / SVG Stage */}
      <div className="relative flex-1 min-h-[300px] overflow-hidden bg-[#091124] flex items-center justify-center select-none">
        
        {/* Background Grid Lines representing Survey Tics */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
            backgroundSize: '24px 24px, 72px 72px, 72px 72px',
          }}
        />

        {/* Village Sema Boundary (Dashed polygon) */}
        <div 
          className="w-full h-full p-4 flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg viewBox="0 0 500 420" className="w-full max-w-[580px] h-auto overflow-visible">
            <defs>
              <pattern id="hatch-disputed" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#ef4444" strokeWidth="1.5" opacity="0.3" />
              </pattern>
              <filter id="glow-selected" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10b981" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Village Outer Limit Line */}
            <path
              d="M 20 50 L 460 20 L 480 320 L 370 400 L 40 370 Z"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.4"
            />
            <text x="240" y="390" fill="#64748b" fontSize="9" textAnchor="middle" letterSpacing="1" fontFamily="monospace">
              VILLAGE SEMA BOUNDARY (हदबस्त सीमा)
            </text>

            {/* Parcels */}
            {GIS_PARCELS.map((parcel) => {
              const isSelected = parcel.id === activeId;
              const isDisputed = parcel.disputed;

              let fillColor = 'rgba(30, 58, 138, 0.25)'; // default navy blue
              let strokeColor = '#3b82f6';

              if (isSelected) {
                fillColor = 'rgba(16, 185, 129, 0.35)'; // emerald
                strokeColor = '#10b981';
              } else if (isDisputed) {
                fillColor = 'rgba(239, 68, 68, 0.25)';
                strokeColor = '#f87171';
              } else if (parcel.status === 'Verified') {
                fillColor = 'rgba(14, 116, 144, 0.25)';
                strokeColor = '#06b6d4';
              }

              return (
                <g 
                  key={parcel.id} 
                  className="cursor-pointer transition-all duration-150 group"
                  onClick={() => handleSelect(parcel)}
                >
                  <path
                    d={parcel.path}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 2.5 : 1.2}
                    filter={isSelected ? 'url(#glow-selected)' : undefined}
                    className="group-hover:fill-sky-500/40 transition-colors"
                  />

                  {/* Parcel centroid label */}
                  <text
                    x={parcel.centroid.x}
                    y={parcel.centroid.y - 4}
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize="10"
                    fontWeight={isSelected ? 'bold' : '600'}
                    textAnchor="middle"
                    className="pointer-events-none select-none drop-shadow"
                  >
                    Khasra #{parcel.khasraNumber}
                  </text>
                  
                  <text
                    x={parcel.centroid.x}
                    y={parcel.centroid.y + 9}
                    fill={isSelected ? '#a7f3d0' : '#94a3b8'}
                    fontSize="8"
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                  >
                    {parcel.area}
                  </text>

                  {/* Pin icon on active parcel */}
                  {isSelected && (
                    <g transform={`translate(${parcel.centroid.x - 6}, ${parcel.centroid.y - 30})`}>
                      <circle cx="6" cy="6" r="4" fill="#10b981" />
                      <line x1="6" y1="10" x2="6" y2="18" stroke="#10b981" strokeWidth="2" />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend / Status Overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/80 text-[10px] space-y-1.5 backdrop-blur-xs">
          <div className="font-semibold text-slate-300 pb-1 border-b border-slate-700">Parcel Ledger Status</div>
          <div className="flex items-center gap-2 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500/80 border border-emerald-400"></span>
            <span>Verified Record</span>
          </div>
          <div className="flex items-center gap-2 text-sky-300">
            <span className="w-2.5 h-2.5 rounded-xs bg-sky-500/80 border border-sky-400"></span>
            <span>Digitized Parcel</span>
          </div>
          <div className="flex items-center gap-2 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500/80 border border-amber-400"></span>
            <span>Pending Review</span>
          </div>
          <div className="flex items-center gap-2 text-red-300">
            <span className="w-2.5 h-2.5 rounded-xs bg-red-500/80 border border-red-400"></span>
            <span>Boundary Disparity</span>
          </div>
        </div>

        {/* Floating Selected Parcel Pill */}
        {activeParcel && (
          <div className="absolute top-3 right-3 bg-slate-900/90 border border-emerald-500/40 rounded-lg p-3 max-w-xs shadow-xl backdrop-blur-xs text-xs animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between gap-3 pb-1.5 border-b border-slate-700/80">
              <span className="font-bold text-white text-xs">
                Khasra #{activeParcel.khasraNumber}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                activeParcel.status === 'Verified' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                activeParcel.status === 'Flagged' ? 'bg-red-950 text-red-300 border border-red-800' :
                'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {activeParcel.status}
              </span>
            </div>
            
            <div className="mt-2 space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Village:</span>
                <span className="font-medium text-white">{activeParcel.village}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Owner:</span>
                <span className="font-medium text-white truncate max-w-[140px]" title={activeParcel.owner}>
                  {activeParcel.owner}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Plot Area:</span>
                <span className="font-mono text-emerald-400">{activeParcel.area}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">ULPIN:</span>
                <span className="font-mono text-sky-400">{activeParcel.ulpin}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/records')}
              className="mt-2.5 w-full py-1 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-[11px] flex items-center justify-center gap-1 transition-colors"
            >
              <span>Inspect Record Folio</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Map Bottom Metadata Footer Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span>Survey Station: ALIPUR-REF-9</span>
          <span className="text-slate-600">•</span>
          <span>DGPS Base: 28.7041° N</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Boundary Hash:</span>
          <span className="text-emerald-400">SHA256:7f4c..9b12</span>
        </div>
      </div>
    </div>
  );
};
