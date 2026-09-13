import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { 
  Bell, 
  ChevronDown, 
  LogOut, 
  UserCheck, 
  ShieldAlert, 
  Lock,
  Layers,
  FileCheck,
  CheckCircle2
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, currentRole, logout, switchRole } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  interface NavItem {
    name: string;
    path: string;
    roles: Role[];
  }

  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', roles: ['ADMIN', 'OFFICER', 'VISITOR'] },
    { name: 'Upload Scan', path: '/upload', roles: ['OFFICER', 'ADMIN'] },
    { name: 'AI Extraction', path: '/extraction', roles: ['OFFICER', 'ADMIN'] },
    { name: 'Officer Review', path: '/review', roles: ['OFFICER', 'ADMIN'] },
    { name: 'Records', path: '/records', roles: ['ADMIN', 'OFFICER', 'VISITOR'] },
    { name: 'Map / GIS', path: '/map', roles: ['ADMIN', 'OFFICER', 'VISITOR'] },
    { name: 'Audit Logs', path: '/audit', roles: ['ADMIN', 'OFFICER'] },
    { name: 'Analytics', path: '/analytics', roles: ['ADMIN'] },
    { name: 'User Management', path: '/users', roles: ['ADMIN'] },
  ];

  const visibleNav = navItems.filter((item) => item.roles.includes(currentRole));

  const handleRoleChange = (role: Role) => {
    switchRole(role);
    setProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => navigate('/dashboard')}>
            <div className="w-10 h-10 rounded-lg bg-[#0f172a] flex items-center justify-center text-white shadow-xs p-1.5 shrink-0">
              {/* Cadastral 4-grid emblem */}
              <div className="grid grid-cols-2 gap-1 w-full h-full p-0.5">
                <div className="bg-white rounded-xs opacity-95"></div>
                <div className="bg-emerald-400 rounded-xs"></div>
                <div className="bg-sky-400 rounded-xs"></div>
                <div className="bg-white rounded-xs opacity-95"></div>
              </div>
            </div>
            <div className="shrink-0 whitespace-nowrap">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="font-bold text-slate-900 tracking-tight text-lg whitespace-nowrap">
                  Bhumi Setu <span className="text-slate-600 font-medium text-sm whitespace-nowrap">(भूमि-सेतु)</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-600 rounded shrink-0">
                  v4.8
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 whitespace-nowrap">
                Cadastral Land Records & Verification Portal
              </p>
            </div>
          </div>

          {/* Navigation links styled exactly like Stitch pills */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-slate-100/70 p-1 rounded-lg border border-slate-200/80 shrink min-w-0 overflow-x-auto mx-2">
            {visibleNav.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-2 xl:px-2.5 2xl:px-3 py-1 text-[11px] xl:text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Right Status & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* System Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>System Active</span>
              <span className="text-emerald-400">•</span>
              <span className="text-[11px] font-mono text-emerald-700">42ms</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-800">Operational Alerts (3)</span>
                    <span className="text-[10px] text-sky-600 cursor-pointer">Mark read</span>
                  </div>
                  <div className="space-y-2.5 mt-2">
                    <div className="flex items-start gap-2 text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0"></span>
                      <div>
                        <p className="font-medium text-slate-800">Flagged Folio #KB-9022</p>
                        <p className="text-[11px] text-slate-500">Discrepancy in Nangli Poona plot area (2.40 vs 2.50)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                      <div>
                        <p className="font-medium text-slate-800">Batch Ingestion #KB-2026-B9</p>
                        <p className="text-[11px] text-slate-500">1,248 folios pre-processed into vector store</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                      <div>
                        <p className="font-medium text-slate-800">Merkle Root Synchronized</p>
                        <p className="text-[11px] text-slate-500">Ledger block #940,211 committed securely</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Officer / User Portal Pill */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#0f172a] text-white flex items-center justify-center text-xs font-bold">
                  {(currentUser?.name?.charAt(0) || 'U').toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentRole === 'OFFICER' ? 'Officer Portal' : currentRole === 'ADMIN' ? 'Admin Portal' : 'Visitor Access'}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    {currentRole === 'OFFICER' ? 'Cadastre Desk' : currentRole === 'ADMIN' ? 'Director Desk' : 'Public Viewer'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Role: {currentRole}
                    </div>
                  </div>

                  {/* Switch Role Quick Actions for Demo Evaluation */}
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/70">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Switch Role (Hackathon Demo)
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => handleRoleChange('ADMIN')}
                        className={`py-1 text-[11px] font-medium rounded border ${
                          currentRole === 'ADMIN'
                            ? 'bg-[#0f172a] text-white border-transparent'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Admin
                      </button>
                      <button
                        onClick={() => handleRoleChange('OFFICER')}
                        className={`py-1 text-[11px] font-medium rounded border ${
                          currentRole === 'OFFICER'
                            ? 'bg-[#0f172a] text-white border-transparent'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Officer
                      </button>
                      <button
                        onClick={() => handleRoleChange('VISITOR')}
                        className={`py-1 text-[11px] font-medium rounded border ${
                          currentRole === 'VISITOR'
                            ? 'bg-[#0f172a] text-white border-transparent'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Visitor
                      </button>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
