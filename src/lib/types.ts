// County Connect — Shared Types

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  national_id?: string;
  role: "citizen" | "admin" | "business";
  avatar_url?: string;
}

// ─── Types ───────────────────────────────────────────────────────────
export interface Application {
  id: string;
  applicant: string;
  applicantId: string;
  applicantEmail: string;
  applicantPhone: string;
  service: string;
  date: string;
  status: "Pending Review" | "Approved" | "Rejected" | "Changes Requested";
  amount: number;
  businessName?: string;
  ward?: string;
  subCounty?: string;
  address?: string;
  type: "citizen" | "business";
  documents?: {
    businessCert?: string;
    kraPinCert?: string;
    identityCard?: string;
  };
}

export interface Tender {
  id: string;
  title: string;
  entity: string;
  value: number;
  status: "Open" | "Evaluated" | "Awarded" | "Cancelled";
  deadline: string;
  awardedTo?: string;
}

export interface Department {
  id: number;
  name: string;
  head: string;
  staff: number;
  services: number;
}

export interface ServiceItem {
  id: number;
  name: string;
  department: string;
  fee: string;
  status: "Active" | "Draft" | "Suspended";
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
  date: string;
  read: boolean;
}

export interface RevenueEntry {
  id: string;
  ref: string;
  amount: number;
  user: string;
  stream: string;
  time: string;
  reconciled: boolean;
}

export interface HealthDrugItem {
  id: number;
  name: string;
  facility: string;
  stock: string;
  level: "critical" | "low" | "high";
}

export interface WelfareProgram {
  id: number;
  name: string;
  status: "Enrolled" | "Waitlist" | "Active" | "Inactive";
  date: string;
  method: string;
}

export interface Petition {
  id: number;
  title: string;
  deadline: string;
  supporters: number;
  totalNeeded: number;
  category: string;
}

export interface LandRecord {
  id: string;
  action: string;
  detail: string;
  status: string;
  hash: string;
  timestamp: string;
}

export interface AnomalyAlert {
  id: number;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  timestamp: string;
  dismissed: boolean;
}
