export type Role = 'ADMIN' | 'OFFICER' | 'VISITOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  designation: string;
  tehsilCluster: string;
  department?: string;
  active?: boolean;
  avatarUrl?: string;
}

export type RecordStatus = 'Verified' | 'Pending' | 'Flagged' | 'Processing';
export type ValidationSeverity = 'VALID' | 'WARNING' | 'FLAGGED';
export type LandClassification = 'Agricultural' | 'Residential' | 'Commercial' | 'Industrial' | 'Government / Common';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
}

export interface ExtractedField {
  key: string;
  label: string;
  hindiLabel: string;
  value: string;
  originalValue: string;
  confidence: number; // 0-100
  isEdited: boolean;
  box?: BoundingBox;
  validationIssue?: string;
  required?: boolean;
}

export interface LandRecord {
  id: string; // e.g. KB-9021
  ulpin: string; // Unique Land Parcel Identification Number
  ownerName: string;
  fatherHusbandName: string;
  surveyNumber: string;
  khasraNumber: string;
  khataNumber: string;
  khewatNumber: string;
  areaAcre: number;
  areaBigha: string;
  village: string;
  tehsil: string;
  district: string;
  landClassification: LandClassification;
  mutationStatus: 'Verified' | 'Pending' | 'Disputed' | 'Under Objection';
  registrationDate: string;
  documentType: string;
  confidence: number;
  status: RecordStatus;
  validationSeverity: ValidationSeverity;
  validationIssues: string[];
  reviewedBy?: string;
  reviewedAt?: string;
  documentImageUrl?: string;
  coOwners?: string[];
  mutationHistory?: {
    id: string;
    date: string;
    type: string;
    fromParty: string;
    toParty: string;
    status: string;
    remarks: string;
  }[];
  fields?: ExtractedField[];
  gisCoordinates?: { lat: number; lng: number };
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  officerName?: string;
  role: Role;
  action: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'AUDIT_LOGGED';
  recordId?: string;
  hash: string;
}

export interface RevenueTerm {
  term: string;
  hindi: string;
  category: string;
  definition: string;
  example: string;
}

export interface GisParcel {
  id: string;
  khasraNumber: string;
  village: string;
  owner: string;
  area: string;
  status: RecordStatus;
  ulpin: string;
  path: string; // SVG path or polygon points
  centroid: { x: number; y: number };
  disputed?: boolean;
}
