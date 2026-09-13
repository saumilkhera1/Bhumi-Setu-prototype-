import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { 
  Shield, 
  Briefcase, 
  Eye, 
  EyeOff, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  Loader2,
  FileText,
  MapPin,
  Check
} from 'lucide-react';
import { CadastralMap } from '../components/CadastralMap';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [selectedRole, setSelectedRole] = useState<Role>('OFFICER');
  const [email, setEmail] = useState<string>('sdm.alipur@gov.in');
  const [password, setPassword] = useState<string>('••••••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [previewState, setPreviewState] = useState<string>('Officer');

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setPreviewState(role);
    setErrorMessage(null);
    if (role === 'ADMIN') {
      setEmail('admin@bhumi-setu.demo');
    } else if (role === 'OFFICER') {
      setEmail('sdm.alipur@gov.in');
    } else {
      setEmail('visitor@bhumi-setu.demo');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please provide valid identification credentials.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      login(selectedRole, email);
      navigate('/dashboard');
    }, 600);
  };

  // Quick preview handler from Image 1 bottom buttons
  const applyPreviewState = (state: string) => {
    setPreviewState(state);
    if (state === 'Admin' || state === 'Officer' || state === 'Visitor') {
      handleRoleSelect(state.toUpperCase() as Role);
    } else if (state === 'Empty') {
      setEmail('');
      setPassword('');
    } else if (state === 'Focused') {
      setIsFocused(true);
    } else if (state === 'Unauthorized') {
      setErrorMessage('Role credentials unverified for State Cadastral Network.');
    } else if (state === 'Error') {
      setErrorMessage('Invalid credentials or expired officer security token.');
    } else if (state === 'Loading') {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    } else if (state === 'Valid') {
      setErrorMessage(null);
      handleRoleSelect('OFFICER');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Government Navigation Header */}
      <header className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-8">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0f172a] flex items-center justify-center p-1.5 shadow-xs">
              <div className="grid grid-cols-2 gap-1 w-full h-full p-0.5">
                <div className="bg-white rounded-xs"></div>
                <div className="bg-emerald-400 rounded-xs"></div>
                <div className="bg-sky-400 rounded-xs"></div>
                <div className="bg-white rounded-xs"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                  Bhumi Setu <span className="text-slate-600 font-medium text-sm">(भूमि-सेतु)</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-600 rounded">
                  v4.8
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                CADASTRAL LAND RECORDS & VERIFICATION PORTAL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>System Active</span>
              <span className="text-emerald-400">•</span>
              <span className="text-[11px] font-mono text-emerald-700">42ms</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-slate-500 font-medium">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>SSL 256-bit Encrypted</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Two-Column Auth Container matching Stitch Layout */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & Access Selection */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-semibold rounded-full uppercase tracking-wide mb-3">
              <Lock className="w-3 h-3 text-sky-600" />
              <span>SECURE ACCESS</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome to Bhumi-Setu
            </h1>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Sign in to access the Land Records & Verification Portal.
            </p>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* SELECT ACCESS ROLE */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    SELECT ACCESS ROLE
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">RBAC Enforced</span>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {/* Admin Card */}
                  <div
                    onClick={() => handleRoleSelect('ADMIN')}
                    className={`cursor-pointer rounded-xl p-3 border transition-all text-left ${
                      selectedRole === 'ADMIN'
                        ? 'bg-[#0f172a] text-white border-transparent shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Shield className={`w-4 h-4 ${selectedRole === 'ADMIN' ? 'text-sky-400' : 'text-slate-400'}`} />
                      <span className={`w-1.5 h-1.5 rounded-full ${selectedRole === 'ADMIN' ? 'bg-emerald-400' : 'bg-slate-300'}`}></span>
                    </div>
                    <div className="font-bold text-xs sm:text-sm">Admin</div>
                    <div className={`text-[10px] mt-0.5 ${selectedRole === 'ADMIN' ? 'text-slate-300' : 'text-slate-400'}`}>
                      Full System Access
                    </div>
                  </div>

                  {/* Officer Card */}
                  <div
                    onClick={() => handleRoleSelect('OFFICER')}
                    className={`cursor-pointer rounded-xl p-3 border transition-all text-left ${
                      selectedRole === 'OFFICER'
                        ? 'bg-[#0f172a] text-white border-transparent shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Briefcase className={`w-4 h-4 ${selectedRole === 'OFFICER' ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span className={`w-1.5 h-1.5 rounded-full ${selectedRole === 'OFFICER' ? 'bg-emerald-400' : 'bg-slate-300'}`}></span>
                    </div>
                    <div className="font-bold text-xs sm:text-sm">Officer</div>
                    <div className={`text-[10px] mt-0.5 ${selectedRole === 'OFFICER' ? 'text-slate-300' : 'text-slate-400'}`}>
                      Land record verification
                    </div>
                  </div>

                  {/* Visitor Card */}
                  <div
                    onClick={() => handleRoleSelect('VISITOR')}
                    className={`cursor-pointer rounded-xl p-3 border transition-all text-left ${
                      selectedRole === 'VISITOR'
                        ? 'bg-[#0f172a] text-white border-transparent shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Eye className={`w-4 h-4 ${selectedRole === 'VISITOR' ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span className={`w-1.5 h-1.5 rounded-full ${selectedRole === 'VISITOR' ? 'bg-emerald-400' : 'bg-slate-300'}`}></span>
                    </div>
                    <div className="font-bold text-xs sm:text-sm">Visitor</div>
                    <div className={`text-[10px] mt-0.5 ${selectedRole === 'VISITOR' ? 'text-slate-300' : 'text-slate-400'}`}>
                      Read-only access
                    </div>
                  </div>
                </div>

                {/* Active Role Description Pill */}
                <div className="mt-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-[11px] text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0"></span>
                  <span className="truncate">
                    {selectedRole === 'ADMIN' && 'Administrator Access • User registry, system policies, database audits'}
                    {selectedRole === 'OFFICER' && 'Officer Verification Access • Document ingestion, AI extraction review & seal approval'}
                    {selectedRole === 'VISITOR' && 'Read-Only Access • Public cadastral parcel search and permitted details'}
                  </span>
                </div>
              </div>

              {/* Email / Officer ID Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Email / Officer ID
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">e.g. rev-tehsildar-04</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter email or government officer ID"
                    className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">Demo: any value</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-10 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-slate-900 rounded border-slate-300 focus:ring-slate-900"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo: Use officer@bhumi-setu.demo or admin@bhumi-setu.demo with any password.'); }} className="text-sky-700 hover:underline font-medium">
                  Forgot Password?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#0f172a] hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                    <span>Verifying Credentials with Cadastre Key...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* ROLE PERMISSIONS Card matching Stitch design */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                  ROLE PERMISSIONS
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 text-slate-700 font-mono rounded">
                  Role: <strong className="text-slate-900">{selectedRole}</strong>
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {selectedRole === 'OFFICER' && (
                  <><strong>Operational Access:</strong> Upload cadastral documents, validate land parcel records, verify GIS boundaries, and inspect audit histories.</>
                )}
                {selectedRole === 'ADMIN' && (
                  <><strong>Administrative Clearance:</strong> Full authority to inspect all district ledgers, manage user roles, view aggregate analytics, and system audit logs.</>
                )}
                {selectedRole === 'VISITOR' && (
                  <><strong>Public Read-Only Access:</strong> Search digitized revenue records and view georeferenced cadastral boundaries without edit or approval privileges.</>
                )}
              </p>
            </div>

            {/* Secure Government Portal notice */}
            <div className="mt-4 flex items-start gap-2 text-[11px] text-slate-500">
              <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Secure Government Portal:</strong> Protected with encrypted authentication & role-based access. Access permissions are enforced according to your assigned role.
              </span>
            </div>

            {/* UI Preview State switcher bar matching bottom of Image 1 */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-400 text-[10px] font-mono mr-1">UI Preview:</span>
              {['Admin', 'Officer', 'Visitor', 'Empty', 'Focused', 'Unauthorized', 'Error', 'Loading', 'Valid'].map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => applyPreviewState(state)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                    previewState === state
                      ? 'bg-slate-900 text-white border-slate-900'
                      : state === 'Unauthorized' || state === 'Error'
                      ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      : state === 'Valid'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Trusted Digital Land Records & Cadastral GIS Preview */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                <span className="text-[11px] font-bold text-slate-700 tracking-wider uppercase">
                  CADASTRAL INTELLIGENCE
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>ULPIN Geofence: Synchronized</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Trusted Digital Land Records
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Securely access and manage digitized land records through a unified verification portal.
            </p>

            {/* Interactive Cadastral Map Widget */}
            <div className="h-[280px] mb-4">
              <CadastralMap selectedParcelId="P-124-2" compact={true} />
            </div>

            {/* Record of Rights / Khasra Khatauni Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2.5">
                <div className="text-xs font-bold text-slate-800">
                  खसरा खतौनी (Record-of-Rights) <span className="text-slate-500 font-normal">मौजा: नंगली पूना (Nangli Poona)</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold text-[10px] rounded border border-emerald-300">
                  ULPIN ASSIGNED
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                    KHASRA / PLOT
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 block">124/2 (Min)</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                    TOTAL AREA
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 block">2.5 Bigha (2,520 sq.yd)</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                    PRIMARY TENURE HOLDER
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 block truncate" title="Rajesh Kumar s/o Ramji Lal">
                    Rajesh Kumar s/o Ramj...
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Bottom Badges matching Stitch reference */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs font-bold text-slate-900">Active</div>
                <div className="text-[10px] text-slate-500">Cadastral Layer</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs font-bold text-slate-900">Geofenced</div>
                <div className="text-[10px] text-slate-500">Survey Parcels</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs font-bold text-slate-900">SHA-256</div>
                <div className="text-[10px] text-slate-500">Tamper-Evident Ledger</div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        Bhumi-Setu • Smart India Hackathon Prototype • Ministry of Rural Development / Land Records Department
      </footer>
    </div>
  );
};
