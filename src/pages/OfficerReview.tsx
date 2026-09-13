import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  X, 
  Send, 
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { RevenueTermTooltip } from '../components/RevenueTermTooltip';

export const OfficerReview: React.FC = () => {
  const navigate = useNavigate();
  const { records, setActiveRecordId, approveRecord, rejectRecord, sendBackRecord } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [confidenceFilter, setConfidenceFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredRecords = records.filter((rec) => {
    if (statusFilter !== 'ALL' && rec.status !== statusFilter) return false;
    if (confidenceFilter === 'LOW' && rec.confidence >= 70) return false;
    if (confidenceFilter === 'MEDIUM' && (rec.confidence < 70 || rec.confidence >= 85)) return false;
    if (confidenceFilter === 'HIGH' && rec.confidence < 85) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        rec.id.toLowerCase().includes(q) ||
        rec.village.toLowerCase().includes(q) ||
        rec.ownerName.toLowerCase().includes(q) ||
        rec.khasraNumber.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenWorkspace = (recId: string) => {
    setActiveRecordId(recId);
    navigate('/extraction');
  };

  const handleBatchApprove = () => {
    selectedRecords.forEach((id) => approveRecord(id));
    setToastMessage(`Batch approved ${selectedRecords.length} records with Sovereign Patwari Seal.`);
    setSelectedRecords([]);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSelectRecord = (id: string) => {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter((r) => r !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            TEHSIL ADJUDICATION DESK • QUEUE MONITOR
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Officer Review & Discrepancy Resolution Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized queue of cadastral records requiring human adjudication, area reconciliation, or seal issuance.
          </p>
        </div>

        {/* Batch Action Bar */}
        {selectedRecords.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2">
            <span className="text-xs font-mono font-bold">
              {selectedRecords.length} Selected
            </span>
            <button
              onClick={handleBatchApprove}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Batch Approve</span>
            </button>
            <button
              onClick={() => setSelectedRecords([])}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Khasra #, Village, Owner, or Folio ID..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            
            {/* Status Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              {['ALL', 'Flagged', 'Pending Review', 'Verified'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status === 'ALL' ? 'All Records' : status}
                </button>
              ))}
            </div>

            {/* Confidence Dropdown */}
            <select
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 font-medium"
            >
              <option value="ALL">All Confidence Levels</option>
              <option value="LOW">Low (&lt; 70%)</option>
              <option value="MEDIUM">Medium (70-84%)</option>
              <option value="HIGH">High (&gt;= 85%)</option>
            </select>

          </div>

        </div>

      </div>

      {/* Records Queue Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedRecords.length === filteredRecords.length && filteredRecords.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRecords(filteredRecords.map((r) => r.id));
                      } else {
                        setSelectedRecords([]);
                      }
                    }}
                    className="rounded border-slate-300 text-slate-900"
                  />
                </th>
                <th className="py-3 px-3">Folio ID</th>
                <th className="py-3 px-3">Village & Tehsil</th>
                <th className="py-3 px-3">Tenure Holder</th>
                <th className="py-3 px-3">Khasra / Plot</th>
                <th className="py-3 px-3">Discrepancy / Issues</th>
                <th className="py-3 px-3">Confidence</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Adjudication Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No cadastral records found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const isSelected = selectedRecords.includes(rec.id);
                  return (
                    <tr
                      key={rec.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-sky-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRecord(rec.id)}
                          className="rounded border-slate-300 text-slate-900"
                        />
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        #{rec.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{rec.village}</div>
                        <div className="text-[10px] text-slate-500">{rec.tehsil}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{rec.ownerName}</div>
                        <div className="text-[10px] text-slate-500">w/o or s/o {rec.fatherHusbandName}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">Khasra #{rec.khasraNumber}</div>
                        <div className="text-[10px] font-mono text-slate-500">{rec.areaAcre} Acre</div>
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        {rec.validationIssues && rec.validationIssues.length > 0 ? (
                          <div className="space-y-0.5">
                            {rec.validationIssues.map((issue, idx) => (
                              <div
                                key={idx}
                                className="text-[10px] text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 flex items-center gap-1"
                              >
                                <AlertTriangle className="w-2.5 h-2.5 shrink-0 text-red-600" />
                                <span className="truncate">{issue}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            No discrepancies
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            rec.confidence >= 85
                              ? 'bg-emerald-100 text-emerald-800'
                              : rec.confidence >= 70
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {rec.confidence.toFixed(1)}%
                        </span>
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
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenWorkspace(rec.id)}
                            className="px-2.5 py-1 bg-[#0f172a] hover:bg-slate-800 text-white font-medium rounded text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>Workspace</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
