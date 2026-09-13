import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  ArrowUpRight, 
  RotateCw, 
  UploadCloud, 
  ShieldCheck, 
  HardDrive, 
  Download, 
  Award, 
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  Clock
} from 'lucide-react';
import { RevenueTermTooltip } from '../components/RevenueTermTooltip';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stats, records, setActiveRecordId, currentRole } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 800);
  };

  const handleInspectRecord = (recordId: string) => {
    setActiveRecordId(recordId);
    if (recordId === 'KB-9022') {
      navigate('/extraction');
    } else {
      navigate(`/records/${recordId}`);
    }
  };

  const handleResolveFlagged = (recordId: string) => {
    setActiveRecordId(recordId);
    navigate('/extraction');
  };

  // Recent 4 folios exactly matching Stitch reference
  const recentFolios = records.slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Subheader Line with Tehsil Cluster & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 pb-1">
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <span>EXECUTIVE OPERATIONS</span>
            <span className="text-slate-300">•</span>
            <span>Tehsil Cluster North-IV</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Cadastral Ledger & Digitization Monitor
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-mono rounded-lg shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ledger Hash: <strong className="text-slate-900">0x9E4B...D381</strong></span>
          </div>

          <button
            onClick={handleSync}
            className="px-3.5 py-1.5 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync Pipeline</span>
          </button>
        </div>
      </div>

      {/* 4 Top Metric Cards matching Stitch design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Scans Ingested */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              TOTAL SCANS INGESTED
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 mt-3">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {stats.totalScans.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-sky-50 text-sky-700 font-semibold text-[10px] rounded border border-sky-200">
              <TrendingUp className="w-2.5 h-2.5" />
              +14% wk
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Raw folio bundles received</p>
        </div>

        {/* Digitized & Verified */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              DIGITIZED & VERIFIED
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 mt-3">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {stats.digitizedVerified.toLocaleString()}
            </span>
            <span className="px-1.5 py-0.5 bg-emerald-600 text-white font-semibold text-[10px] rounded">
              70.2% Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Tamper-evident sovereign index</p>
        </div>

        {/* Pending Officer Review */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              PENDING OFFICER REVIEW
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 mt-3">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {stats.pendingReview}
            </span>
            <span className="px-1.5 py-0.5 bg-[#b91c1c] text-white font-semibold text-[10px] rounded">
              Action Req.
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Boundary & owner disparity flags</p>
        </div>

        {/* Indic-HTR Accuracy */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              INDIC-HTR ACCURACY
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 mt-3">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {stats.ocrAccuracy}%
            </span>
            <span className="px-1.5 py-0.5 bg-[#0f172a] text-white font-semibold text-[10px] rounded">
              Dual-Model
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Modi, Kaithi & Persian script models</p>
        </div>

      </div>

      {/* Digitization Pipeline Progression Banner matching Stitch */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Digitization Pipeline Progression
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Batch Stream #KB-2026-B9
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Step 1 */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">1. Document Upload</div>
              <div className="text-[11px] text-slate-500">Completed (1,248/1,248)</div>
            </div>
          </div>

          {/* Step 2 (Active) */}
          <div className="flex items-center gap-3 p-3 bg-sky-50/80 border border-sky-200 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <RotateCw className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <div className="text-xs font-bold text-sky-950">2. AI Pre-process & HTR</div>
              <div className="text-[11px] text-sky-700 font-medium">Active (84% Processing)</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold">
              3
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">3. Conflict Detection</div>
              <div className="text-[11px] text-slate-500">Queued (42 In-Flight)</div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold">
              4
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">4. Officer Adjudication</div>
              <div className="text-[11px] text-slate-500">Final Sign-off Desk</div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Two-Column Layout (Left ~60%, Right ~40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: 7-Day Velocity Chart & Recent Folios Table */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 7-Day Folio Ingestion Velocity Chart Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                7-Day Folio Ingestion Velocity
              </h2>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#0f172a]"></span>
                  <span>Scanned</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600"></span>
                  <span>Verified</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              High-throughput raster archival vs digitized parcel models
            </p>

            {/* Paired Bar Chart */}
            <div className="h-44 flex items-end justify-between gap-3 px-2 pt-2 pb-1 border-b border-slate-200">
              {[
                { day: 'Mon', scanned: 55, verified: 35 },
                { day: 'Tue', scanned: 70, verified: 50 },
                { day: 'Wed', scanned: 45, verified: 40 },
                { day: 'Thu', scanned: 85, verified: 72 },
                { day: 'Fri', scanned: 90, verified: 80 },
                { day: 'Sat', scanned: 80, verified: 70 },
                { day: 'Today', scanned: 95, verified: 88, highlight: true },
              ].map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full flex items-end justify-center gap-1 h-36">
                    {/* Scanned bar */}
                    <div
                      className="w-3.5 bg-[#0f172a] rounded-t-xs transition-all group-hover:opacity-85"
                      style={{ height: `${item.scanned}%` }}
                      title={`Scanned: ${item.scanned}`}
                    />
                    {/* Verified bar */}
                    <div
                      className="w-3.5 bg-emerald-600 rounded-t-xs transition-all group-hover:opacity-85"
                      style={{ height: `${item.verified}%` }}
                      title={`Verified: ${item.verified}`}
                    />
                  </div>
                  <span className={`text-[11px] font-medium ${item.highlight ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Land Folios Under Review Table Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Recent Land Folios Under Review
                </h2>
              </div>
              <button
                onClick={() => navigate('/records')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                View All 1,248
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-2.5 px-2">Document ID</th>
                    <th className="py-2.5 px-2">Village / Tehsil</th>
                    <th className="py-2.5 px-2">Record Type</th>
                    <th className="py-2.5 px-2">Confidence</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentFolios.map((folio) => (
                    <tr key={folio.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-2 font-mono font-bold text-slate-900">
                        #{folio.id}
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-semibold text-slate-800">{folio.village}</div>
                        <div className="text-[10px] text-slate-500">{folio.tehsil}</div>
                      </td>
                      <td className="py-3 px-2 text-slate-600 font-medium">
                        {folio.documentType.includes('Jamabandi') ? (
                          <RevenueTermTooltip term="Jamabandi">{folio.documentType}</RevenueTermTooltip>
                        ) : folio.documentType.includes('Khasra') ? (
                          <RevenueTermTooltip term="Khasra">{folio.documentType}</RevenueTermTooltip>
                        ) : folio.documentType.includes('Mutation') ? (
                          <RevenueTermTooltip term="Mutation">{folio.documentType}</RevenueTermTooltip>
                        ) : folio.documentType.includes('Aks Shajra') ? (
                          <RevenueTermTooltip term="Aks Shajra">{folio.documentType}</RevenueTermTooltip>
                        ) : (
                          folio.documentType
                        )}
                      </td>
                      <td className="py-3 px-2 font-mono font-bold">
                        <span className={folio.confidence >= 85 ? 'text-emerald-700' : folio.confidence >= 70 ? 'text-amber-600' : 'text-red-600'}>
                          {folio.confidence.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          folio.status === 'Verified'
                            ? 'bg-emerald-800 text-white'
                            : folio.status === 'Flagged'
                            ? 'bg-[#b91c1c] text-white'
                            : 'bg-amber-600 text-white'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          {folio.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        {folio.status === 'Flagged' ? (
                          <button
                            onClick={() => handleResolveFlagged(folio.id)}
                            className="px-2.5 py-1 bg-[#b91c1c] hover:bg-red-800 text-white font-medium rounded text-[11px] transition-colors cursor-pointer"
                          >
                            Resolve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleInspectRecord(folio.id)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded text-[11px] transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>

        {/* Right Column: Cadastral Fast Actions & System Health & Security */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Cadastral Fast Actions Card matching Stitch */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Cadastral Fast Actions
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Desk v2.8</span>
            </div>

            <div className="space-y-2.5">
              {/* Upload New Folio Scan */}
              <button
                onClick={() => navigate('/upload')}
                className="w-full py-2.5 px-4 bg-[#0f172a] hover:bg-slate-800 text-white rounded-lg font-semibold text-xs flex items-center justify-between transition-colors shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload New Folio Scan</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Review Flagged Discrepancies */}
              <button
                onClick={() => navigate('/review')}
                className="w-full py-2.5 px-4 bg-[#b91c1c] hover:bg-red-800 text-white rounded-lg font-semibold text-xs flex items-center justify-between transition-colors shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Review Flagged Discrepancies</span>
                </div>
                <span className="px-2 py-0.5 bg-white text-[#b91c1c] font-bold text-[10px] rounded">
                  142
                </span>
              </button>

              {/* Two side-by-side buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => navigate('/map')}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export GeoJSON</span>
                </button>
                <button
                  onClick={() => navigate('/audit')}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Audit Certificate</span>
                </button>
              </div>
            </div>
          </div>

          {/* System Health & Security Card matching Stitch */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>System Health & Security</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-800 text-white text-[10px] font-bold rounded">
                Operational
              </span>
            </div>

            <div className="space-y-3 text-xs">
              
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <Cpu className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900">Dual-Model Indic HTR Engine</div>
                    <div className="text-[10px] text-slate-500">CRNN + Vision Transformer active</div>
                  </div>
                </div>
                <span className="font-mono text-slate-900 font-semibold text-[11px]">99.8% Online</span>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900">Blockchain Audit Trail</div>
                    <div className="text-[10px] text-slate-500">SHA-256 Merkle tree verification</div>
                  </div>
                </div>
                <span className="font-mono text-slate-900 font-semibold text-[11px]">Block #940,211</span>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <Layers className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900">Zero-Loss Folio Compression</div>
                    <div className="text-[10px] text-slate-500">TIFF G4 to JBIG2 raster pipeline</div>
                  </div>
                </div>
                <span className="font-mono text-slate-900 font-semibold text-[11px]">Lossless Bit-exact</span>
              </div>

              {/* Archival Storage Bar */}
              <div className="pt-1">
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Archival Storage (Local Node)</span>
                  <span className="font-mono font-semibold text-slate-800">6.2 TB / 10 TB</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#0f172a] h-2 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>

            </div>
          </div>

          {/* Sovereign Validation Seal Card matching bottom right */}
          <div className="bg-[#0f172a] text-white rounded-xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-950 border border-sky-700/50 flex items-center justify-center text-sky-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-tight">Sovereign Validation Seal</div>
                <div className="text-[10px] text-slate-300">Next Signoff Queue: Tehsil Desk 1</div>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-sky-500/20 border border-sky-400 text-sky-300 text-[10px] font-bold rounded tracking-wider">
              READY
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
