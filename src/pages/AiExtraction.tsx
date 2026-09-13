import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Edit3, 
  Check, 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  SlidersHorizontal, 
  CornerDownLeft, 
  Command, 
  HelpCircle, 
  Eye, 
  Layers, 
  ArrowRight,
  Send,
  AlertCircle
} from 'lucide-react';
import { KeyboardShortcutsModal } from '../components/KeyboardShortcutsModal';
import { RevenueTermTooltip } from '../components/RevenueTermTooltip';

export const AiExtraction: React.FC = () => {
  const navigate = useNavigate();
  const { getActiveRecord, updateRecordField, approveRecord, rejectRecord, sendBackRecord, currentRole } = useApp();
  
  const record = getActiveRecord() || {
    id: 'KB-9022',
    village: 'Nangli Poona',
    khasraNumber: '124/2',
    status: 'Flagged',
    validationSeverity: 'FLAGGED',
    confidence: 79.2,
    fields: [],
    validationIssues: [],
  } as any;

  // Selected field for editing & bounding box highlight
  const [selectedFieldKey, setSelectedFieldKey] = useState<string>('areaAcre');
  const [editingValue, setEditingValue] = useState<string>('2.50');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [invertFilter, setInvertFilter] = useState<boolean>(false);
  const [showOcrOverlay, setShowOcrOverlay] = useState<boolean>(true);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Sync editing value when selected field changes
  useEffect(() => {
    const currentField = (record.fields || []).find((f: any) => f.key === selectedFieldKey);
    if (currentField) {
      setEditingValue(currentField.value);
    }
  }, [selectedFieldKey, record]);

  // Keyboard navigation support (Section 19)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const fields = record.fields || [];
        const currentIndex = fields.findIndex((f: any) => f.key === selectedFieldKey);
        const nextIndex = e.shiftKey
          ? (currentIndex - 1 + fields.length) % fields.length
          : (currentIndex + 1) % fields.length;
        setSelectedFieldKey(fields[nextIndex].key);
        setIsEditing(false);
      } else if (e.key === 'Enter' && isEditing) {
        handleSaveCorrection();
      } else if (e.key === 'Escape') {
        setIsEditing(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFieldKey, isEditing, editingValue, record]);

  const handleSaveCorrection = () => {
    if (!selectedFieldKey) return;
    updateRecordField(record.id, selectedFieldKey, editingValue);
    setIsEditing(false);
    setActionSuccessMsg(`Field "${selectedFieldKey}" updated to "${editingValue}". Human stamp recorded.`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleApprove = () => {
    approveRecord(record.id);
    setActionSuccessMsg(`Cadastral record #${record.id} successfully verified and sealed.`);
    setTimeout(() => {
      setActionSuccessMsg(null);
      navigate('/records');
    }, 1200);
  };

  const handleReject = () => {
    rejectRecord(record.id, 'Discrepancy in extracted area numeral vs registry');
    setActionSuccessMsg(`Record #${record.id} flagged for field resurvey.`);
    setTimeout(() => setActionSuccessMsg(null), 2500);
  };

  const handleSendBack = () => {
    sendBackRecord(record.id, 'Request re-binarization and OCR contrast tuning');
    setActionSuccessMsg(`Record #${record.id} sent back to Digitization Operator.`);
    setTimeout(() => setActionSuccessMsg(null), 2500);
  };

  const activeField = (record.fields || []).find((f: any) => f.key === selectedFieldKey) || (record.fields || [])[5];

  return (
    <div className="space-y-4 pb-12">
      
      {/* Top Workspace Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-slate-200 rounded-xl shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-900 text-white rounded">
              SMART VERIFICATION WORKSPACE
            </span>
            <span className="text-xs font-mono font-bold text-slate-800">
              Folio #{record.id}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              record.status === 'Verified' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
              record.status === 'Flagged' ? 'bg-red-100 text-red-800 border border-red-300' :
              'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {record.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Village: <strong className="text-slate-800">{record.village}</strong> • Khasra:{' '}
            <RevenueTermTooltip term="Khasra">
              <strong className="text-slate-800">#{record.khasraNumber}</strong>
            </RevenueTermTooltip>{' '}
            • Tehsil: {record.tehsil}
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShortcutsOpen(true)}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Keyboard Shortcuts"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Shortcuts</span>
          </button>

          {currentRole !== 'VISITOR' && (
            <>
              <button
                onClick={handleSendBack}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3 h-3 text-slate-500" />
                <span>Send Back</span>
              </button>

              <button
                onClick={handleReject}
                className="px-3 py-1.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>

              <button
                onClick={handleApprove}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Approve & Seal</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Success Banner */}
      {actionSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Dual Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ================= LEFT PANE: CADASTRAL DOCUMENT VIEWER ================= */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-sm flex flex-col h-[750px]">
          
          {/* Document Viewer Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-slate-800 text-xs text-white">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold text-slate-200 truncate max-w-[200px]">
                Nangli_Poona_Jamabandi_1968.pdf
              </span>
              <span className="text-[10px] text-slate-400 font-mono">400 DPI</span>
            </div>

            {/* Viewer Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setInvertFilter(!invertFilter)}
                className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                  invertFilter ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="Toggle High-Contrast Binarization"
              >
                Contrast / Invert
              </button>

              <button
                onClick={() => setShowOcrOverlay(!showOcrOverlay)}
                className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                  showOcrOverlay ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="Toggle OCR Bounding Boxes"
              >
                OCR Bounding
              </button>

              <div className="flex items-center bg-slate-800 rounded px-1">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.8))}
                  className="p-1 text-slate-300 hover:text-white"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono px-1 text-slate-300">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.7))}
                  className="p-1 text-slate-300 hover:text-white"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Document Render Area with Simulated Archival Folio */}
          <div className="relative flex-1 overflow-auto bg-[#182030] p-4 flex items-center justify-center select-none">
            
            <div
              className={`relative w-full max-w-[500px] h-[650px] bg-[#fbf8ee] text-slate-900 p-6 rounded-md shadow-2xl transition-all duration-200 border border-amber-200/60 font-serif ${
                invertFilter ? 'invert hue-rotate-180 contrast-125' : ''
              }`}
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                backgroundImage: 'radial-gradient(#e2d9c2 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            >
              {/* Archaic Watermark & Official Stamp */}
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-2 border-dashed border-red-800/40 flex flex-col items-center justify-center rotate-[-12deg] text-[8px] text-red-900/60 font-mono pointer-events-none">
                <span className="font-bold">DELHI PROVINCE</span>
                <span>REVENUE SEAL</span>
                <span>1968-69</span>
              </div>

              {/* Folio Heading in Hindi / Devanagari */}
              <div className="text-center pb-3 border-b-2 border-slate-800/60 mb-3">
                <div className="text-[10px] uppercase tracking-widest text-slate-600 font-sans font-semibold">
                  तहसील सदर • ज़िला दिल्ली (उत्तर)
                </div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900 mt-0.5">
                  नकल खसरा जमाबंदी (Record of Rights)
                </h3>
                <div className="text-[11px] text-slate-700 italic font-sans">
                  मौजा (Village): नंगली पूना • साल बंदोबस्त (Settlement): 1968
                </div>
              </div>

              {/* Simulated Ledger Columns Grid */}
              <div className="border border-slate-800/70 text-[10px] font-sans">
                <div className="grid grid-cols-4 bg-amber-100/70 border-b border-slate-800/70 font-bold p-1 text-center">
                  <span>खाता/खेवट</span>
                  <span>मालिक का नाम व वल्दियत</span>
                  <span>खसरा नं.</span>
                  <span>रकबा (क्षेत्रफल)</span>
                </div>

                <div className="p-2 space-y-3 font-mono text-[10px] leading-relaxed">
                  <div className="grid grid-cols-4 border-b border-slate-200 pb-2">
                    <span>KH-1980</span>
                    <span className="font-serif">Baldev Singh</span>
                    <span>123/1</span>
                    <span>1.10 Acre</span>
                  </div>

                  {/* Target Active Record Row */}
                  <div className="grid grid-cols-4 border-b border-amber-300 pb-2 bg-amber-50/50">
                    <span className="font-bold">KH-2098</span>
                    <div className="font-serif">
                      <div className="font-bold text-slate-950">Rajesh Kumar</div>
                      <div className="text-[9px] text-slate-600">s/o Mahesh Kumar</div>
                    </div>
                    <span className="font-bold text-slate-950">124/2</span>
                    <div>
                      {/* Smudged Area numeral depiction */}
                      <span className="font-bold text-red-900 bg-red-100/80 px-1 py-0.5 rounded border border-red-300">
                        2.40 Acre
                      </span>
                      <div className="text-[8px] text-slate-500 italic mt-0.5">(ink smudge)</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 border-b border-slate-200 pb-2">
                    <span>KH-3140</span>
                    <span className="font-serif">Suresh Chandra</span>
                    <span>125/3</span>
                    <span>3.45 Acre</span>
                  </div>
                </div>
              </div>

              {/* Archival Notes & Patwari Signatures */}
              <div className="mt-8 pt-4 border-t border-slate-800/40 text-[10px] flex justify-between items-end">
                <div>
                  <div className="text-slate-600">कैफियत दाखिल खारिज:</div>
                  <div className="font-serif italic text-slate-800">
                    बमुताबिक हुक्म तहसीलदार साहब मोर्खा 12 अप्रेल 2018
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-serif font-bold text-slate-900">दस्तखत पटवारी हलका</div>
                  <div className="text-[9px] text-slate-500 font-mono">Seal: DL-REV-PAT-12</div>
                </div>
              </div>

              {/* ================= INTERACTIVE OCR BOUNDING BOX OVERLAYS ================= */}
              {showOcrOverlay && (record.fields || []).map((field: any) => {
                if (!field.box) return null;
                const isSelected = field.key === selectedFieldKey;
                const isLowConfidence = field.confidence < 85;

                return (
                  <div
                    key={field.key}
                    onClick={() => {
                      setSelectedFieldKey(field.key);
                      setEditingValue(field.value);
                      setIsEditing(true);
                    }}
                    className={`absolute cursor-pointer rounded-xs transition-all duration-150 ${
                      isSelected
                        ? 'ring-2 ring-emerald-500 bg-emerald-500/25 z-30 shadow-lg'
                        : isLowConfidence
                        ? 'border-2 border-red-500 bg-red-500/20 z-20 animate-pulse'
                        : 'border border-sky-400/80 bg-sky-400/10 hover:bg-sky-400/30'
                    }`}
                    style={{
                      left: `${field.box.x}%`,
                      top: `${field.box.y}%`,
                      width: `${field.box.width}%`,
                      height: `${field.box.height}%`,
                    }}
                    title={`${field.label}: ${field.value} (${field.confidence}%)`}
                  >
                    {/* Bounding box label tag */}
                    <span
                      className={`absolute -top-4 left-0 text-[8px] font-mono font-bold px-1 rounded shadow-xs whitespace-nowrap pointer-events-none ${
                        isSelected
                          ? 'bg-emerald-700 text-white'
                          : isLowConfidence
                          ? 'bg-red-700 text-white'
                          : 'bg-sky-800 text-white'
                      }`}
                    >
                      {field.label}: {field.confidence}%
                    </span>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Bounding Box Footnote */}
          <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Bounding Box: {activeField?.box ? `X:${activeField.box.x}% Y:${activeField.box.y}%` : 'Simulated OCR Box'}</span>
            <span className="text-emerald-400">Indic-HTR Model v2.4</span>
          </div>
        </div>

        {/* ================= RIGHT PANE: STRUCTURED FIELDS & VALIDATION ================= */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Active Field Quick Editor Card */}
          <div className="bg-white border-2 border-sky-600/40 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-sky-700" />
                <span className="text-xs font-bold text-slate-900">
                  Officer Field Editor • <span className="text-sky-700">{activeField?.label}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 font-medium">Confidence:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeField?.confidence >= 85
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : activeField?.confidence >= 70
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {activeField?.confidence}% {activeField?.confidence < 85 && '⚠ Needs Verification'}
                </span>
              </div>
            </div>

            {/* Editor Input Row */}
            <div className="mt-3 flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => {
                    setEditingValue(e.target.value);
                    setIsEditing(true);
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                  placeholder="Enter corrected value"
                />
                {activeField?.key === 'areaAcre' && (
                  <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>
                      Original folio script smudge: <strong>2.40 Acre</strong>. Confirmed registry value: <strong>2.50 Acre</strong>.
                    </span>
                  </p>
                )}
              </div>

              <button
                onClick={handleSaveCorrection}
                className="px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save Correction</span>
              </button>
            </div>
          </div>

          {/* Validation Engine Rule-Check Box (Section 11) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  Simulated Validation Engine
                </h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                record.validationSeverity === 'VALID'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
                STATUS: {record.validationSeverity}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Required fields present</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Format validation</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Village/District consistency</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Master data check</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-700">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Duplicate Khasra detection</span>
              </div>
              <div className={`flex items-center gap-1.5 ${record.areaAcre === 2.5 ? 'text-slate-700' : 'text-amber-700'}`}>
                {record.areaAcre === 2.5 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>Area consistency check</span>
              </div>
            </div>

            {/* Flagged Explanations */}
            {record.validationIssues && record.validationIssues.length > 0 && (
              <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 space-y-1">
                <div className="font-semibold flex items-center gap-1 text-amber-900">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Validation Warning Details:</span>
                </div>
                {record.validationIssues.map((issue: string, idx: number) => (
                  <div key={idx} className="pl-4 text-[10px]">• {issue}</div>
                ))}
              </div>
            )}
          </div>

          {/* Structured Fields Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
              <h3 className="text-xs font-bold text-slate-900">
                Extracted Structured Fields ({record.fields?.length || 0})
              </h3>
              <span className="text-[10px] text-slate-400">
                Threshold: &gt;=85% High, 70-84% Med, &lt;70% Low
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto pr-1">
              {(record.fields || []).map((field: any) => {
                const isSelected = field.key === selectedFieldKey;
                const isLow = field.confidence < 85;

                return (
                  <div
                    key={field.key}
                    onClick={() => {
                      setSelectedFieldKey(field.key);
                      setEditingValue(field.value);
                      setIsEditing(true);
                    }}
                    className={`py-2.5 px-3 flex items-center justify-between rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-50/80 border border-sky-300'
                        : isLow
                        ? 'bg-red-50/40 hover:bg-red-50 border border-red-200/60'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-800">
                          {field.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-hindi">
                          ({field.hindiLabel})
                        </span>
                        {field.isEdited && (
                          <span className="text-[9px] px-1 py-0.2 bg-emerald-100 text-emerald-700 font-semibold rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-950 mt-0.5 font-mono">
                        {field.value || <span className="text-slate-400 italic">Not detected</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        field.confidence >= 85
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : field.confidence >= 70
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                      }`}>
                        {field.confidence}%
                      </span>
                      <Edit3 className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

    </div>
  );
};
