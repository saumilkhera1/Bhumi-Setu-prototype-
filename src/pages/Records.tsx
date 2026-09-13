import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  Eye, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  MapPin
} from 'lucide-react';
import { RevenueTermTooltip } from '../components/RevenueTermTooltip';

export const Records: React.FC = () => {
  const navigate = useNavigate();
  const { records, setActiveRecordId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [villageFilter, setVillageFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const villages = ['ALL', ...Array.from(new Set(records.map((r) => r.village)))];

  const filtered = records.filter((r) => {
    if (villageFilter !== 'ALL' && r.village !== villageFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && r.landClassification !== typeFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        r.id.toLowerCase().includes(q) ||
        r.ownerName.toLowerCase().includes(q) ||
        r.khasraNumber.toLowerCase().includes(q) ||
        r.village.toLowerCase().includes(q) ||
        (r.ulpin && r.ulpin.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleExportCsv = () => {
    const headers = ['ID,Village,Tehsil,Owner,Khasra,Area_Acre,Status,ULPIN'];
    const rows = filtered.map(
      (r) =>
        `"${r.id}","${r.village}","${r.tehsil}","${r.ownerName}","${r.khasraNumber}","${r.areaAcre}","${r.status}","${r.ulpin || 'N/A'}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bhumi_Setu_Records_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            CADASTRAL DIRECTORY • SOVEREIGN LEDGER
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Digitized Land Records Index
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete database of verified and pending land ownership folios, geo-referenced Khasra parcels, and ULPIN records.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span>Export Ledger (CSV)</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Owner, Khasra, ULPIN..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          {/* Village Filter */}
          <div>
            <select
              value={villageFilter}
              onChange={(e) => setVillageFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none"
            >
              <option value="ALL">All Villages (सभी मौजा)</option>
              {villages.filter((v) => v !== 'ALL').map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none"
            >
              <option value="ALL">All Ledger Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Flagged">Flagged for Discrepancy</option>
            </select>
          </div>

          {/* Land Classification */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none"
            >
              <option value="ALL">All Classifications</option>
              <option value="Agricultural">Agricultural (कृषि भूमि)</option>
              <option value="Residential">Residential (आवासीय)</option>
              <option value="Commercial">Commercial (व्यावसायिक)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-3">Folio ID</th>
                <th className="py-3 px-3">Tenure Holder</th>
                <th className="py-3 px-3">Village / Mauza</th>
                <th className="py-3 px-3">Khasra / Plot</th>
                <th className="py-3 px-3">Khata / Khewat</th>
                <th className="py-3 px-3">Plot Area</th>
                <th className="py-3 px-3">ULPIN</th>
                <th className="py-3 px-3">Ledger Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No cadastral records found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      #{rec.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{rec.ownerName}</div>
                      <div className="text-[10px] text-slate-500">s/o {rec.fatherHusbandName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{rec.village}</div>
                      <div className="text-[10px] text-slate-500">{rec.tehsil}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900">
                        <RevenueTermTooltip term="Khasra">#{rec.khasraNumber}</RevenueTermTooltip>
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {rec.khataNumber} / {rec.khewatNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{rec.areaAcre} Acre</div>
                      <div className="text-[10px] text-slate-500">{(rec.areaAcre * 1.6).toFixed(2)} Bigha</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-sky-700">
                      {rec.ulpin || <span className="text-slate-400 italic">Pending GIS</span>}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          rec.status === 'Verified'
                            ? 'bg-emerald-800 text-white'
                            : rec.status === 'Flagged'
                            ? 'bg-[#b91c1c] text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setActiveRecordId(rec.id);
                          navigate(`/records/${rec.id}`);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
