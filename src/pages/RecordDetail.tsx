import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  MapPin, 
  Clock, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  UserCheck, 
  Calendar,
  Layers,
  Edit3
} from 'lucide-react';
import { CadastralMap } from '../components/CadastralMap';
import { RevenueTermTooltip } from '../components/RevenueTermTooltip';

export const RecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { records, auditLogs, setActiveRecordId, currentRole } = useApp();
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const record = records.find((r) => r.id === id) || records[0];
  const recordLogs = record ? auditLogs.filter((l) => l.recordId === record.id) : [];

  if (!record) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-3">
        <h2 className="text-lg font-bold text-slate-800">Record Not Found</h2>
        <p className="text-xs text-slate-500">The requested cadastral folio could not be found or has not been ingested yet.</p>
        <button
          onClick={() => navigate('/records')}
          className="px-4 py-2 bg-[#0f172a] text-white rounded-lg text-xs font-semibold"
        >
          Return to Records Directory
        </button>
      </div>
    );
  }

  const handleEditWorkspace = () => {
    setActiveRecordId(record.id);
    navigate('/extraction');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Top Navigation & Back link */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => navigate('/records')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Records Directory</span>
        </button>

        <div className="flex items-center gap-2">
          {currentRole !== 'VISITOR' && (
            <button
              onClick={handleEditWorkspace}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Open in Verification Workspace</span>
            </button>
          )}

          <button
            onClick={() => setShowCertificateModal(true)}
            className="px-3.5 py-1.5 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Sovereign RoR Certificate</span>
          </button>
        </div>
      </div>

      {/* Primary Record Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Khasra Folio #{record.id}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  record.status === 'Verified'
                    ? 'bg-emerald-800 text-white'
                    : record.status === 'Flagged'
                    ? 'bg-[#b91c1c] text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                {record.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Document Classification: <strong className="text-slate-800">{record.documentType}</strong> • Mauza: <strong className="text-slate-800">{record.village}</strong>
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end text-xs font-mono">
            <span className="text-slate-400">ULPIN Unique Parcel ID:</span>
            <span className="font-bold text-sky-700 text-sm">
              {record.ulpin || 'Pending GIS Geofence Verification'}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              SHA256: 0x9e4b...77f1
            </span>
          </div>
        </div>

        {/* Core Attributes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              PRIMARY TENURE HOLDER
            </span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {record.ownerName}
            </span>
            <span className="text-[11px] text-slate-500">s/o {record.fatherHusbandName}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              KHASRA / PLOT NUMBER
            </span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              #{record.khasraNumber}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Khata: {record.khataNumber} | Khewat: {record.khewatNumber}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              REGISTERED AREA
            </span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {record.areaAcre} Acre
            </span>
            <span className="text-[11px] text-slate-500">{(record.areaAcre * 1.6).toFixed(2)} Bigha</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              LAND CLASSIFICATION
            </span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {record.landClassification}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">Non-Ceiling Exempt</span>
          </div>
        </div>
      </div>

      {/* Two-Column Detail Grid: Map + Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Geographical Cadastral Parcel Map */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Cadastral Survey & GIS Boundary
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Aks Shajra Sheet #12
            </span>
          </div>

          <div className="h-[320px]">
            <CadastralMap selectedParcelId="P-124-2" compact={true} />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Tehsil Jurisdiction:</span>
              <span className="font-semibold text-slate-800">{record.tehsil}, {record.district}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Survey Station Landmark:</span>
              <span className="font-mono text-slate-800">DGPS-ALIPUR-NW-04</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Boundary Closure Error:</span>
              <span className="font-mono text-emerald-700">&lt; 0.02m (Passes National Standard)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Full Ledger Attribute Sheet */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              <h2 className="text-sm font-bold text-slate-900">
                Record-of-Rights (खसरा खतौनी) Attributes
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Confidence: {record.confidence.toFixed(1)}%
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Revenue District (ज़िला):</span>
              <span className="font-semibold text-slate-900">{record.district}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Sub-Division / Tehsil (तहसील):</span>
              <span className="font-semibold text-slate-900">{record.tehsil}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Revenue Village / Mauza (मौजा):</span>
              <span className="font-semibold text-slate-900">{record.village}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Hadbast Number (हदबस्त नं.):</span>
              <span className="font-mono font-semibold text-slate-900">HB-412</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Khatauni Number (खतौनी नं.):</span>
              <span className="font-mono font-semibold text-slate-900">{record.khataNumber}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Khewat Number (खेवट नं.):</span>
              <span className="font-mono font-semibold text-slate-900">{record.khewatNumber}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Land Ceiling Category:</span>
              <span className="font-semibold text-slate-900">Standard Agricultural Ceiling Exemption</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Last Mutation Order Date:</span>
              <span className="font-mono text-slate-800">12 Apr 2018</span>
            </div>
          </div>
        </div>

      </div>

      {/* Audit Log Chronological Timeline for this Record */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Chronological Audit Trail & Mutation History
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {recordLogs.length} Events Recorded
          </span>
        </div>

        <div className="space-y-3">
          {recordLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div className="mt-0.5">
                {log.action.includes('Approved') || log.action.includes('Created') ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">{log.details}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                  <span>Officer: <strong className="text-slate-700">{log.officerName || log.user || 'Official Desk'}</strong></span>
                  <span>•</span>
                  <span className="font-mono text-slate-400">Hash: {log.hash}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sovereign RoR Certificate Modal for Printing / Download */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 text-slate-900 animate-in fade-in zoom-in-95 font-serif">
            
            {/* Certificate Border Header */}
            <div className="border-4 border-double border-slate-900 p-6 relative">
              <div className="text-center pb-4 border-b border-slate-800 mb-4 font-sans">
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
                  GOVERNMENT OF NCT OF DELHI • REVENUE DEPARTMENT
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-950 mt-1 font-serif">
                  प्रमाणित खसरा खतौनी (Record-of-Rights)
                </h2>
                <div className="text-xs text-slate-600 font-mono mt-0.5">
                  ULPIN: {record.ulpin || 'DL-07-124-02'} • SHA-256 Verified
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <p>
                  This is to certify that under the provisions of the Delhi Land Revenue Act, the parcel of land specified herein is officially recorded in the Sovereign Cadastral Ledger:
                </p>

                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-300 font-sans text-xs">
                  <div><strong>Village (मौजा):</strong> {record.village}</div>
                  <div><strong>Tehsil:</strong> {record.tehsil}</div>
                  <div><strong>Khasra Number:</strong> #{record.khasraNumber}</div>
                  <div><strong>Area:</strong> {record.areaAcre} Acre ({(record.areaAcre * 1.6).toFixed(2)} Bigha)</div>
                  <div><strong>Primary Holder:</strong> {record.ownerName}</div>
                  <div><strong>Parentage:</strong> s/o {record.fatherHusbandName}</div>
                  <div><strong>Classification:</strong> {record.landClassification}</div>
                  <div><strong>Status:</strong> {record.status}</div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  Digitally certified by Bhumi-Setu Intelligent Land Record Verification Node. Tamper-proof cryptographic signature stored at block #940,211.
                </p>
              </div>

              {/* Signatures */}
              <div className="mt-8 pt-4 border-t border-slate-800 flex justify-between items-end font-sans text-xs">
                <div>
                  <div className="font-mono text-[10px] text-slate-500">Certificate No: BS-ROR-2026-9022</div>
                  <div className="text-[10px] text-slate-400">Date of Generation: {new Date().toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">Sub-Divisional Magistrate</div>
                  <div className="text-[10px] text-slate-500 font-mono">Alipur Sub-District, Delhi</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2 font-sans text-xs">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
