import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  Image as ImageIcon,
  Check,
  RefreshCw,
  FolderOpen,
  Info
} from 'lucide-react';
import { RevenueTermTooltip } from '../components/RevenueTermTooltip';

export const UploadScan: React.FC = () => {
  const navigate = useNavigate();
  const { addNewIngestedFolio } = useApp();

  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>({
    name: 'Nangli_Poona_Jamabandi_1968_KB9022.pdf',
    size: '4.8 MB',
    type: 'application/pdf',
  });

  const [documentType, setDocumentType] = useState('Mutation Register');
  const [language, setLanguage] = useState('Hindi (Devanagari) & Urdu');
  const [district, setDistrict] = useState('North Delhi');
  const [tehsil, setTehsil] = useState('Sector 12-A Alipur');
  const [village, setVillage] = useState('Nangli Poona');

  // Multi-step simulated extraction states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const steps = [
    { title: 'Uploading Folio Raster', sub: 'Streaming 400 DPI uncompressed TIFF G4 bundle' },
    { title: 'Image Pre-processing', sub: 'Adaptive binarization, deskewing & speckle removal' },
    { title: 'Indic HTR & OCR', sub: 'Dual-model CRNN + Vision Transformer active' },
    { title: 'Language & Script Detection', sub: 'Modi, Kaithi & Persian cursive tokens classified' },
    { title: 'AI Field Extraction & NER', sub: 'Extracting Owner, Khasra, Khata, Plot Area & ULPIN' },
    { title: 'Rule-based Validation', sub: 'Cross-checking geometry against Aks Shajra GIS layer' },
  ];

  const handleStartExtraction = () => {
    setIsProcessing(true);
    setProcessingStep(0);

    const stepInterval = setInterval(() => {
      setProcessingStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsProcessing(false);
            // Ingest new record or activate KB-9022
            addNewIngestedFolio({
              village,
              tehsil,
              district,
              documentType,
            });
            navigate('/extraction');
          }, 600);
          return prev;
        }
      });
    }, 450);
  };

  const sampleFolios = [
    {
      title: 'Jamabandi 1968 Folio #124 (Smudged Area Numeral)',
      filename: 'Nangli_Poona_Jamabandi_1968_KB9022.pdf',
      size: '4.8 MB',
      type: 'Mutation Register',
      lang: 'Hindi (Devanagari) & Urdu',
      village: 'Nangli Poona',
      tehsil: 'Sector 12-A Alipur',
    },
    {
      title: 'Ancestral Khasra Record 1954 (Kaithi Script)',
      filename: 'Alipur_Khasra_Ancestral_1954.tiff',
      size: '8.2 MB',
      type: 'Khasra Jamabandi',
      lang: 'Hindi & Kaithi',
      village: 'Alipur',
      tehsil: 'Sub-Div 04 Alipur',
    },
    {
      title: 'Aks Shajra Village Map Sheet #12',
      filename: 'Bakhtawarpur_Aks_Shajra_Cadastral.jpg',
      size: '12.4 MB',
      type: 'Cadastral Map',
      lang: 'Urdu & English',
      village: 'Bakhtawarpur',
      tehsil: 'Alipur Sub-District',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          INGESTION WORKFLOW • BATCH STREAM
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
          Cadastral Folio Ingestion & Pre-Processing
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Ingest scanned historical revenue documents for Indic-HTR, automated Named Entity Recognition, and cadastral reconciliation.
        </p>
      </div>

      {/* Main Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Drag & Drop Zone */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Upload Cadastral Document</h2>
            <span className="text-[11px] text-slate-400 font-mono">PDF, PNG, JPG, TIFF up to 50MB</span>
          </div>

          {/* Drag & Drop Visual Area */}
          <div className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-2xs text-sky-700">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-slate-900">
              Drag and drop cadastral folio bundle here
            </div>
            <p className="text-[11px] text-slate-500 mt-1 mb-3">
              Supports multi-page scanned deeds, mutation registers, and high-resolution cadastral map sheets
            </p>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs cursor-pointer">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Browse Local Disk</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.tiff"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const f = e.target.files[0];
                    setSelectedFile({
                      name: f.name,
                      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
                      type: f.type || 'application/octet-stream',
                    });
                  }
                }}
              />
            </label>
          </div>

          {/* Selected File Details Box */}
          {selectedFile && (
            <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                  PDF
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{selectedFile.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Size: {selectedFile.size} • 400 DPI Grayscale Raster
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Check className="w-3 h-3" />
                Validated
              </span>
            </div>
          )}

          {/* Sample Legacy Documents Picker for Hackathon Demonstration */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                OR SELECT PRE-LOADED HACKATHON SAMPLE FOLIO:
              </span>
              <span className="text-[10px] text-sky-700 font-medium">Quick Test</span>
            </div>
            <div className="space-y-2">
              {sampleFolios.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedFile({ name: sample.filename, size: sample.size, type: 'pdf' });
                    setDocumentType(sample.type);
                    setLanguage(sample.lang);
                    setVillage(sample.village);
                    setTehsil(sample.tehsil);
                  }}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    selectedFile?.name === sample.filename
                      ? 'bg-[#0f172a] text-white border-slate-900 shadow-2xs'
                      : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{sample.title}</span>
                    <span className={`text-[10px] font-mono ${selectedFile?.name === sample.filename ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {sample.size}
                    </span>
                  </div>
                  <div className={`text-[10px] mt-0.5 ${selectedFile?.name === sample.filename ? 'text-slate-300' : 'text-slate-500'}`}>
                    {sample.village} • {sample.type} • {sample.lang}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Metadata Configuration & Processing Action */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
          
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Cadastral Folio Metadata
          </h2>

          <div className="space-y-3.5 text-xs">
            
            {/* Document Type */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Document Classification
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="Mutation Register">Mutation Register (दाखिल खारिज)</option>
                <option value="Jamabandi">Jamabandi (जमाबंदी)</option>
                <option value="Khasra Record">Khasra Record (खसरा)</option>
                <option value="Cadastral Map">Cadastral Map / Aks Shajra (अक्स शजरा)</option>
                <option value="Handwritten Register">Handwritten Register (हस्तलिखित पंजिका)</option>
                <option value="Historical / Legacy Document">Historical / Legacy Document (पुरातन अभिलेख)</option>
                <option value="Scanned PDF">Scanned PDF</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Archival Script & Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="Hindi (Devanagari) & Urdu">Hindi (Devanagari) & Urdu Nastaliq</option>
                <option value="Hindi (Devanagari)">Hindi (Standard Devanagari)</option>
                <option value="Urdu (Nastaliq / Shikasta)">Urdu (Nastaliq / Shikasta)</option>
                <option value="Kaithi / Modi Script">Kaithi / Modi Historical Cursive</option>
                <option value="English">English (Colonial Settlement)</option>
                <option value="Other Indian Languages">Other Indian Languages</option>
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Revenue District
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            {/* Tehsil */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Tehsil / Sub-Division
              </label>
              <input
                type="text"
                value={tehsil}
                onChange={(e) => setTehsil(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            {/* Village */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Village (Mauza / मौजा)
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleStartExtraction}
              disabled={isProcessing}
              className="w-full py-2.5 px-4 bg-[#0f172a] hover:bg-slate-800 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Start Intelligent Extraction</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Automated OCR, confidence scoring & rule validation will run sequentially.
            </p>
          </div>

        </div>

      </div>

      {/* Simulated Processing Modal Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-xs animate-in fade-in zoom-in-95">
            
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-[#0f172a] text-white flex items-center justify-center">
                <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Intelligent Extraction in Progress</h3>
                <p className="text-[11px] text-slate-500">Processing: {selectedFile?.name}</p>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="my-4">
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span>Pipeline Progression</span>
                <span className="font-mono font-bold text-slate-900">
                  {Math.round(((processingStep + 1) / steps.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0f172a] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((processingStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Steps Checklist */}
            <div className="space-y-2.5 my-4">
              {steps.map((step, idx) => {
                const isDone = idx < processingStep;
                const isCurrent = idx === processingStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 p-2 rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-sky-50 border border-sky-200 text-sky-950'
                        : isDone
                        ? 'text-slate-800'
                        : 'text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-sky-600 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 text-[10px] flex items-center justify-center font-mono">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-xs">{step.title}</div>
                      <div className="text-[10px] text-slate-500">{step.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 text-center font-mono">
              Redirecting to Smart Verification Workspace upon validation...
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
