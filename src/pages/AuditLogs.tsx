import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Cpu,
  UserCheck
} from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (roleFilter !== 'ALL' && log.role !== roleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const officer = log.officerName || log.user || '';
      const recId = log.recordId || '';
      const action = log.action || '';
      const details = log.details || '';
      const hash = log.hash || '';

      const match =
        recId.toLowerCase().includes(q) ||
        action.toLowerCase().includes(q) ||
        officer.toLowerCase().includes(q) ||
        details.toLowerCase().includes(q) ||
        hash.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleExportLogs = () => {
    const headers = ['ID,Timestamp,Record_ID,Officer_Name,Role,Action,Details,SHA256_Hash'];
    const rows = filteredLogs.map(
      (l) =>
        `"${l.id}","${l.timestamp}","${l.recordId || ''}","${l.officerName || l.user || 'System'}","${l.role}","${l.action}","${l.details}","${l.hash}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bhumi_Setu_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            GOVERNANCE & INTEGRITY • MERKLE TREE LOG
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Cryptographic Audit Trail & Traceability Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable, non-repudiable log of every AI extraction, officer field correction, mutation endorsement, and sovereign seal.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Merkle Root: <strong>0x7f4c..9b12 (Synced)</strong></span>
          </div>

          <button
            onClick={handleExportLogs}
            className="px-3.5 py-1.5 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit records, actions, officer names, hashes..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-medium"
            >
              <option value="ALL">All Event Sources</option>
              <option value="OFFICER">Officer Actions Only</option>
              <option value="ADMIN">Administrator Actions Only</option>
              <option value="SYSTEM">System AI Operations</option>
            </select>
          </div>

        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Folio ID</th>
                <th className="py-3 px-3">Actor / Officer</th>
                <th className="py-3 px-3">Action Recorded</th>
                <th className="py-3 px-3">Details & Adjudication Context</th>
                <th className="py-3 px-3">SHA-256 Seal Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLogs.map((log) => {
                const actorName = log.officerName || log.user || 'Officer';
                const initialChar = actorName ? actorName.charAt(0).toUpperCase() : 'O';

                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {log.recordId ? `#${log.recordId}` : '—'}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-700">
                          {log.role === 'SYSTEM' ? 'AI' : initialChar}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{actorName}</div>
                          <div className="text-[10px] text-slate-400">{log.role}</div>
                        </div>
                      </div>
                    </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        log.action.includes('Approved') || log.action.includes('Verified')
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action.includes('Corrected') || log.action.includes('Updated')
                          ? 'bg-sky-100 text-sky-800'
                          : log.action.includes('Flagged') || log.action.includes('Rejected')
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 max-w-md text-slate-600 text-[11px]">
                    {log.details}
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 border border-slate-200">
                      {log.hash}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
