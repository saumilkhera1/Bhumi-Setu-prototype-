import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { AccessRestricted } from './components/AccessRestricted';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { UploadScan } from './pages/UploadScan';
import { AiExtraction } from './pages/AiExtraction';
import { OfficerReview } from './pages/OfficerReview';
import { Records } from './pages/Records';
import { RecordDetail } from './pages/RecordDetail';
import { GisMap } from './pages/GisMap';
import { AuditLogs } from './pages/AuditLogs';
import { Analytics } from './pages/Analytics';
import { UserManagement } from './pages/UserManagement';

// Guard component checking role access
const RoleProtected: React.FC<{
  allowedRoles: string[];
  element: React.ReactElement;
  requiredRoleName: string;
}> = ({ allowedRoles, element, requiredRoleName }) => {
  const { currentRole } = useApp();
  if (!allowedRoles.includes(currentRole)) {
    return <AccessRestricted requiredRole={requiredRoleName} />;
  }
  return element;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useApp();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Main App Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Officer / Admin Protected */}
        <Route
          path="/upload"
          element={
            <RoleProtected
              allowedRoles={['OFFICER', 'ADMIN']}
              requiredRoleName="OFFICER or ADMIN"
              element={<UploadScan />}
            />
          }
        />
        <Route
          path="/extraction"
          element={
            <RoleProtected
              allowedRoles={['OFFICER', 'ADMIN']}
              requiredRoleName="OFFICER or ADMIN"
              element={<AiExtraction />}
            />
          }
        />
        <Route
          path="/review"
          element={
            <RoleProtected
              allowedRoles={['OFFICER', 'ADMIN']}
              requiredRoleName="OFFICER or ADMIN"
              element={<OfficerReview />}
            />
          }
        />

        {/* Public / All Roles */}
        <Route path="/records" element={<Records />} />
        <Route path="/records/:id" element={<RecordDetail />} />
        <Route path="/map" element={<GisMap />} />

        {/* Officer & Admin Protected */}
        <Route
          path="/audit"
          element={
            <RoleProtected
              allowedRoles={['OFFICER', 'ADMIN']}
              requiredRoleName="OFFICER or ADMIN"
              element={<AuditLogs />}
            />
          }
        />

        {/* Admin Only */}
        <Route
          path="/analytics"
          element={
            <RoleProtected
              allowedRoles={['ADMIN']}
              requiredRoleName="ADMIN"
              element={<Analytics />}
            />
          }
        />
        <Route
          path="/users"
          element={
            <RoleProtected
              allowedRoles={['ADMIN']}
              requiredRoleName="ADMIN"
              element={<UserManagement />}
            />
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
