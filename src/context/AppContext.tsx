import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, LandRecord, AuditEntry } from '../types';
import { DEMO_USERS, INITIAL_LAND_RECORDS, INITIAL_AUDIT_LOGS } from '../data/mockData';

interface AppContextType {
  currentUser: User;
  currentRole: Role;
  isAuthenticated: boolean;
  records: LandRecord[];
  auditLogs: AuditEntry[];
  activeRecordId: string;
  login: (role: Role, email?: string) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
  setActiveRecordId: (id: string) => void;
  getActiveRecord: () => LandRecord | undefined;
  updateRecordField: (recordId: string, fieldKey: string, newValue: string) => void;
  approveRecord: (recordId: string, officerName?: string) => void;
  rejectRecord: (recordId: string, reason: string) => void;
  sendBackRecord: (recordId: string, reason: string) => void;
  addNewIngestedFolio: (folio: Partial<LandRecord>) => string;
  stats: {
    totalScans: number;
    digitizedVerified: number;
    pendingReview: number;
    flagged: number;
    ocrAccuracy: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS.OFFICER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [records, setRecords] = useState<LandRecord[]>(INITIAL_LAND_RECORDS);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(INITIAL_AUDIT_LOGS);
  const [activeRecordId, setActiveRecordId] = useState<string>('KB-9022');

  const currentRole = currentUser.role;

  const login = (role: Role, email?: string) => {
    const user = DEMO_USERS[role];
    setCurrentUser(email ? { ...user, email } : user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchRole = (role: Role) => {
    setCurrentUser(DEMO_USERS[role]);
  };

  const getActiveRecord = () => {
    return records.find((r) => r.id === activeRecordId) || records[1] || records[0];
  };

  const updateRecordField = (recordId: string, fieldKey: string, newValue: string) => {
    let oldVal = '';
    let fieldLabel = fieldKey;

    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id !== recordId) return rec;

        const updatedFields = (rec.fields || []).map((f) => {
          if (f.key === fieldKey) {
            oldVal = f.value;
            fieldLabel = f.label;
            return {
              ...f,
              value: newValue,
              isEdited: true,
              confidence: 98.5, // Officer human verification boosts field confidence
              validationIssue: undefined,
            };
          }
          return f;
        });

        // Special handling for plot area
        const isAreaField = fieldKey === 'areaAcre';
        const newAreaNum = isAreaField ? parseFloat(newValue) || rec.areaAcre : rec.areaAcre;
        const newAreaBigha = isAreaField ? `${newValue} Acre (${(parseFloat(newValue) * 1.05).toFixed(2)} Bigha)` : rec.areaBigha;

        // Recompute overall confidence
        const avgConfidence = updatedFields.length
          ? Math.round(updatedFields.reduce((acc, f) => acc + f.confidence, 0) / updatedFields.length * 10) / 10
          : rec.confidence;

        // If area was updated from 2.40 to 2.50 on KB-9022, remove the area discrepancy issue
        const cleanedIssues = rec.validationIssues.filter((issue) => {
          if (isAreaField && (issue.includes('Plot Area') || issue.includes('Registry area states'))) {
            return false;
          }
          return true;
        });

        return {
          ...rec,
          fields: updatedFields,
          areaAcre: newAreaNum,
          areaBigha: newAreaBigha,
          confidence: avgConfidence,
          validationIssues: cleanedIssues,
          validationSeverity: cleanedIssues.length === 0 ? 'VALID' : rec.validationSeverity,
        };
      })
    );

    // Append to audit log
    const newAuditEntry: AuditEntry = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: currentUser.name,
      officerName: currentUser.name,
      role: currentUser.role,
      action: `Officer updated ${fieldLabel}`,
      details: `Field value revised from "${oldVal}" to "${newValue}" on record #${recordId}. Human verification stamp recorded.`,
      status: 'AUDIT_LOGGED',
      recordId,
      hash: `0x${Math.random().toString(16).substring(2, 6)}..${Math.random().toString(16).substring(2, 6)}`,
    };

    setAuditLogs((prev) => [newAuditEntry, ...prev]);
  };

  const approveRecord = (recordId: string, officerName?: string) => {
    const reviewer = officerName || currentUser.name;

    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id !== recordId) return rec;
        return {
          ...rec,
          status: 'Verified',
          validationSeverity: 'VALID',
          validationIssues: [],
          confidence: Math.max(rec.confidence, 98.5),
          mutationStatus: 'Verified',
          reviewedBy: reviewer,
          reviewedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        };
      })
    );

    const newAuditEntry: AuditEntry = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: reviewer,
      officerName: reviewer,
      role: currentUser.role,
      action: 'Record approved & sovereign seal applied',
      details: `Cadastral record #${recordId} officially validated and committed to State Ledger index.`,
      status: 'SUCCESS',
      recordId,
      hash: `0x${Math.random().toString(16).substring(2, 6)}..${Math.random().toString(16).substring(2, 6)}`,
    };

    setAuditLogs((prev) => [newAuditEntry, ...prev]);
  };

  const rejectRecord = (recordId: string, reason: string) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id !== recordId) return rec;
        return {
          ...rec,
          status: 'Flagged',
          validationSeverity: 'FLAGGED',
          validationIssues: [...rec.validationIssues, `Rejection by officer: ${reason}`],
        };
      })
    );

    const newAuditEntry: AuditEntry = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: currentUser.name,
      officerName: currentUser.name,
      role: currentUser.role,
      action: 'Record rejected / returned for field resurvey',
      details: `Record #${recordId} rejected with ground objection: ${reason}`,
      status: 'WARNING',
      recordId,
      hash: `0x${Math.random().toString(16).substring(2, 6)}..${Math.random().toString(16).substring(2, 6)}`,
    };

    setAuditLogs((prev) => [newAuditEntry, ...prev]);
  };

  const sendBackRecord = (recordId: string, reason: string) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id !== recordId) return rec;
        return {
          ...rec,
          status: 'Pending',
          validationIssues: [...rec.validationIssues, `Sent back for re-indexing: ${reason}`],
        };
      })
    );

    const newAuditEntry: AuditEntry = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: currentUser.name,
      officerName: currentUser.name,
      role: currentUser.role,
      action: 'Record sent back to Digitization Operator',
      details: `Sent back for re-scan / contrast correction: ${reason}`,
      status: 'AUDIT_LOGGED',
      recordId,
      hash: `0x${Math.random().toString(16).substring(2, 6)}..${Math.random().toString(16).substring(2, 6)}`,
    };

    setAuditLogs((prev) => [newAuditEntry, ...prev]);
  };

  const addNewIngestedFolio = (folio: Partial<LandRecord>): string => {
    const newId = `KB-${9040 + records.length}`;
    const newRecord: LandRecord = {
      id: newId,
      ulpin: `DL-07-${Math.floor(100 + Math.random() * 900)}-01`,
      ownerName: folio.ownerName || 'Rajeshwar Prasad Goel',
      fatherHusbandName: folio.fatherHusbandName || 'Laxman Prasad Goel',
      surveyNumber: folio.surveyNumber || '55/1',
      khasraNumber: folio.khasraNumber || '155/1',
      khataNumber: folio.khataNumber || 'KH-3310',
      khewatNumber: 'KW-77',
      areaAcre: folio.areaAcre || 2.15,
      areaBigha: `${folio.areaAcre || 2.15} Bigha (2,170 sq.yd)`,
      village: folio.village || 'Nangli Poona',
      tehsil: folio.tehsil || 'Alipur Sub-District',
      district: folio.district || 'North Delhi',
      landClassification: folio.landClassification || 'Agricultural',
      mutationStatus: 'Pending',
      registrationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      documentType: folio.documentType || 'Scanned PDF',
      confidence: 81.2,
      status: 'Pending',
      validationSeverity: 'WARNING',
      validationIssues: ['Area numeral verification recommended from original handwritten Kaithi register.'],
      fields: [
        { key: 'ownerName', label: 'Owner Name', hindiLabel: 'मालिक का नाम', value: folio.ownerName || 'Rajeshwar Prasad Goel', originalValue: folio.ownerName || 'Rajeshwar Prasad Goel', confidence: 96, isEdited: false, required: true },
        { key: 'fatherHusbandName', label: 'Father / Husband Name', hindiLabel: 'पिता / पति का नाम', value: folio.fatherHusbandName || 'Laxman Prasad Goel', originalValue: folio.fatherHusbandName || 'Laxman Prasad Goel', confidence: 94, isEdited: false },
        { key: 'khasraNumber', label: 'Khasra Number', hindiLabel: 'खसरा संख्या', value: folio.khasraNumber || '155/1', originalValue: folio.khasraNumber || '155/1', confidence: 92, isEdited: false, required: true },
        { key: 'khataNumber', label: 'Khata Number', hindiLabel: 'खाता संख्या', value: folio.khataNumber || 'KH-3310', originalValue: folio.khataNumber || 'KH-3310', confidence: 91, isEdited: false },
        { key: 'areaAcre', label: 'Plot Area (Acres)', hindiLabel: 'रकबा (क्षेत्रफल)', value: String(folio.areaAcre || '2.15'), originalValue: String(folio.areaAcre || '2.15'), confidence: 74, isEdited: false, required: true, validationIssue: 'Area confidence 74% requires officer check' },
        { key: 'village', label: 'Village', hindiLabel: 'ग्राम / मौजा', value: folio.village || 'Nangli Poona', originalValue: folio.village || 'Nangli Poona', confidence: 98, isEdited: false, required: true },
        { key: 'tehsil', label: 'Tehsil', hindiLabel: 'तहसील', value: folio.tehsil || 'Alipur Sub-District', originalValue: folio.tehsil || 'Alipur Sub-District', confidence: 97, isEdited: false },
        { key: 'district', label: 'District', hindiLabel: 'ज़िला', value: folio.district || 'North Delhi', originalValue: folio.district || 'North Delhi', confidence: 99, isEdited: false },
      ],
    };

    setRecords((prev) => [newRecord, ...prev]);
    setActiveRecordId(newId);

    const newAuditEntry: AuditEntry = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: currentUser.name,
      officerName: currentUser.name,
      role: currentUser.role,
      action: 'Document uploaded & AI Ingestion Started',
      details: `New cadastral folio #${newId} ingested for ${newRecord.village} (${newRecord.khasraNumber})`,
      status: 'SUCCESS',
      recordId: newId,
      hash: `0x${Math.random().toString(16).substring(2, 6)}..${Math.random().toString(16).substring(2, 6)}`,
    };

    setAuditLogs((prev) => [newAuditEntry, ...prev]);
    return newId;
  };

  // Stats calculation
  const totalScans = 1248 + (records.length - INITIAL_LAND_RECORDS.length);
  const digitizedVerified = 876 + records.filter((r) => r.status === 'Verified' && r.reviewedAt).length;
  const pendingReview = 142 - records.filter((r) => r.status === 'Verified' && r.reviewedAt).length;
  const flagged = records.filter((r) => r.status === 'Flagged').length;
  const ocrAccuracy = 96.4;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        records,
        auditLogs,
        activeRecordId,
        login,
        logout,
        switchRole,
        setActiveRecordId,
        getActiveRecord,
        updateRecordField,
        approveRecord,
        rejectRecord,
        sendBackRecord,
        addNewIngestedFolio,
        stats: {
          totalScans,
          digitizedVerified,
          pendingReview,
          flagged,
          ocrAccuracy,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
