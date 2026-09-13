import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowLeft, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  requiredRole?: string;
}

export const AccessRestricted: React.FC<Props> = ({ requiredRole = 'OFFICER or ADMIN' }) => {
  const { currentRole, switchRole } = useApp();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto my-16 p-8 bg-white border border-slate-200 rounded-xl shadow-xs text-center">
      <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
        <Lock className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full mb-3">
        <ShieldAlert className="w-3.5 h-3.5" />
        RBAC ENFORCED • 403 FORBIDDEN
      </div>

      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
        Access Restricted
      </h2>

      <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
        Your current role (<strong className="text-slate-800 font-semibold">{currentRole}</strong>) does not have operational clearance to access this module. Authorized roles: <strong className="text-slate-800">{requiredRole}</strong>.
      </p>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-left text-xs mb-6 max-w-md mx-auto">
        <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-sky-600" />
          Hackathon Evaluation Role Override
        </div>
        <p className="text-slate-500 mb-2">
          As an evaluator, you can switch to an Officer or Admin account to inspect this feature:
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => switchRole('OFFICER')}
            className="flex-1 py-1.5 bg-[#0f172a] text-white font-medium rounded hover:bg-slate-800 transition-colors"
          >
            Switch to Officer
          </button>
          <button
            onClick={() => switchRole('ADMIN')}
            className="flex-1 py-1.5 bg-white border border-slate-300 text-slate-700 font-medium rounded hover:bg-slate-100 transition-colors"
          >
            Switch to Admin
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Return to Dashboard
        </button>
        <button
          onClick={() => navigate('/records')}
          className="px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Browse Public Records
        </button>
      </div>
    </div>
  );
};
