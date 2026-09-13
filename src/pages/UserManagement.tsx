import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Role } from '../types';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Edit2, 
  Trash2,
  Briefcase,
  Eye,
  Key
} from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { switchRole, currentRole } = useApp();

  const [users, setUsers] = useState<User[]>([
    {
      id: 'USR-01',
      name: 'R. K. Sharma',
      email: 'sdm.alipur@gov.in',
      role: 'OFFICER',
      designation: 'Sub-Divisional Magistrate',
      tehsilCluster: 'Alipur Sub-District (Cluster 07)',
      department: 'Revenue & Cadastre (Alipur)',
      active: true,
    },
    {
      id: 'USR-02',
      name: 'Priya Meena',
      email: 'admin@bhumi-setu.demo',
      role: 'ADMIN',
      designation: 'Director of Land Records',
      tehsilCluster: 'HQ Directorate',
      department: 'Directorate of Land Records',
      active: true,
    },
    {
      id: 'USR-03',
      name: 'Public Viewer Citizen',
      email: 'visitor@bhumi-setu.demo',
      role: 'VISITOR',
      designation: 'Citizen / Evaluator',
      tehsilCluster: 'Public Access',
      department: 'General Citizen Access',
      active: true,
    },
    {
      id: 'USR-04',
      name: 'Devinder Singh (Patwari)',
      email: 'patwari.nangli@gov.in',
      role: 'OFFICER',
      designation: 'Patwari Halqa',
      tehsilCluster: 'Alipur Sub-District (Cluster 07)',
      department: 'Mauza Nangli Poona Field Desk',
      active: true,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>('OFFICER');
  const [newDept, setNewDept] = useState('Alipur Sub-District Desk');
  const [toast, setToast] = useState<string | null>(null);

  const handleRoleToggle = (userId: string, role: Role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    setToast(`Updated role for user ${userId} to ${role}.`);
    setTimeout(() => setToast(null), 2500);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newUser: User = {
      id: `USR-0${users.length + 1}`,
      name: newName,
      email: newEmail,
      role: newRole,
      designation: newRole === 'ADMIN' ? 'Administrator' : newRole === 'OFFICER' ? 'Revenue Officer' : 'Public Viewer',
      tehsilCluster: 'Sub-District Zone',
      department: newDept,
      active: true,
    };

    setUsers([...users, newUser]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setToast(`Created new official access account: ${newName} (${newRole})`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            ADMINISTRATIVE GOVERNANCE • RBAC REGISTRY
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Officer Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Provision, audit, and calibrate administrative clearances for Sub-Divisional Magistrates, Patwaris, and public citizens.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Provision New Officer</span>
        </button>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-3">Officer Name</th>
                <th className="py-3 px-3">Email / ID</th>
                <th className="py-3 px-3">Jurisdiction Desk</th>
                <th className="py-3 px-3">Assigned Role</th>
                <th className="py-3 px-3">State Status</th>
                <th className="py-3 px-3 text-right">Role Calibration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {u.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {u.email}
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    {u.department}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : u.role === 'OFFICER'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active Clearance
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleToggle(u.id, e.target.value as Role)}
                        className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-800"
                      >
                        <option value="ADMIN">Set Admin</option>
                        <option value="OFFICER">Set Officer</option>
                        <option value="VISITOR">Set Visitor</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-xs animate-in fade-in">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-3">
              Provision New Cadastral Officer Account
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Officer Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Anand Swarup (Naib Tehsildar)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Government Email / ID</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. naib.tehsildar.alipur@gov.in"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">System Clearance Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as Role)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="OFFICER">Officer (Verification & Sealing Desk)</option>
                  <option value="ADMIN">Admin (Executive Directorate)</option>
                  <option value="VISITOR">Visitor (Citizen Read-Only)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jurisdiction / Department</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0f172a] text-white rounded-lg font-semibold"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
