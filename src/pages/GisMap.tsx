import React, { useState } from 'react';
import { CadastralMap } from '../components/CadastralMap';
import { GisParcel } from '../types';
import { GIS_PARCELS } from '../data/mockData';
import { 
  MapPin, 
  Search, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  CheckCircle2, 
  FileText,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RevenueTermTooltip } from '../components/RevenueTermTooltip';

export const GisMap: React.FC = () => {
  const navigate = useNavigate();
  const [selectedParcel, setSelectedParcel] = useState<GisParcel>(GIS_PARCELS[1]);
  const [searchKhasra, setSearchKhasra] = useState<string>('');

  const handleSelectParcel = (parcel: GisParcel) => {
    setSelectedParcel(parcel);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = GIS_PARCELS.find((p) =>
      p.khasraNumber.toLowerCase().includes(searchKhasra.trim().toLowerCase())
    );
    if (found) {
      setSelectedParcel(found);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            CADASTRAL GIS SPATIAL ENGINE • EPSG:3857
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Georeferenced Cadastral Parcel Map (अक्स शजरा)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sovereign digital cadastral map aligned with modern DGPS survey stations, Dakhil-Kharij parcels, and ULPIN registry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(GIS_PARCELS, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", "alipur_cadastral_parcels.geojson");
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download GeoJSON Layer</span>
          </button>
        </div>
      </div>

      {/* Main Map + Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Full Interactive Cadastral Map (8 cols) */}
        <div className="lg:col-span-8 h-[650px]">
          <CadastralMap
            selectedParcelId={selectedParcel.id}
            onSelectParcel={handleSelectParcel}
          />
        </div>

        {/* Right Column: Parcel Attribute Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Search Parcel Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-900 mb-2">
              Locate Parcel by Khasra Number
            </h3>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchKhasra}
                  onChange={(e) => setSearchKhasra(e.target.value)}
                  placeholder="e.g. 124/2, 124/1, 125/3..."
                  className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Locate
              </button>
            </form>
          </div>

          {/* Parcel Inspector Card */}
          {selectedParcel && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    INSPECTED PARCEL
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    Khasra #{selectedParcel.khasraNumber}
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedParcel.status === 'Verified'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : selectedParcel.status === 'Flagged'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {selectedParcel.status}
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs space-y-2">
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Revenue Village:</span>
                  <span className="font-semibold text-slate-900">{selectedParcel.village}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Primary Holder:</span>
                  <span className="font-semibold text-slate-900">{selectedParcel.owner}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Calculated GIS Area:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedParcel.area}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Unique ULPIN:</span>
                  <span className="font-mono font-semibold text-sky-700">{selectedParcel.ulpin}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Centroid Coordinates:</span>
                  <span className="font-mono text-slate-700">{selectedParcel.coordinates}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Boundary Closure:</span>
                  <span className="font-mono text-emerald-700">0.012m (Permitted)</span>
                </div>
              </div>

              {selectedParcel.disputed && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Boundary Disparity Detected</div>
                    <div className="text-[11px] text-red-700 mt-0.5">
                      Extracted area in raw scan (2.40 Acre) diverges from GIS polygon geometry (2.50 Acre). Officer adjudication needed.
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate('/records')}
                className="w-full py-2 bg-[#0f172a] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Full Record Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Cadastral Layer Info Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Compass className="w-4 h-4 text-sky-600" />
              <span>Sovereign Geodetic Integration</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Boundaries are linked to Survey of India (SOI) CORS network benchmarks. Every parcel vertex is encrypted and stored in the Merkle ledger for tamper-evident validation.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
