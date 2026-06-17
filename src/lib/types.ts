// County Connect — localStorage-backed data store with event bus
// Replaces all hardcoded mock data throughout the app

import { KENYAN_CITIZEN_NAMES, KENYAN_COMPANIES, DEPARTMENT_HEADS, generatePhone, generateEmail } from "./names";
import { supabase } from "./supabase";

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

// ─── Event Bus ───────────────────────────────────────────────────────
type EventCallback = (data: unknown) => void;
const listeners: Record<string, EventCallback[]> = {};

export function subscribe(event: string, callback: EventCallback) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(callback);
  return () => {
    listeners[event] = listeners[event].filter((cb) => cb !== callback);
  };
}

export function emit(event: string, data?: unknown) {
  if (listeners[event]) {
    listeners[event].forEach((cb) => cb(data));
  }
}

// ─── Storage Helpers ─────────────────────────────────────────────────
function getStore<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`cc:${key}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function setStore<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`cc:${key}`, JSON.stringify(data));
}

// ─── Seed Data ───────────────────────────────────────────────────────
function generateDateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

function generateTimeStr(): string {
  const h = String(Math.floor(Math.random() * 12) + 7).padStart(2, "0");
  const m = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  return `${h}:${m}`;
}

function seedApplications(): Application[] {
  const services = [
    "Single Business Permit",
    "Land Rates Payment",
    "Construction Permit",
    "Liquor License Renewal",
    "Fire Inspection Certificate",
    "Parking Seasonal Pass",
    "Food Hygiene License",
    "Advertising Permit",
    "Market Stall Allocation",
    "Trade License",
  ];
  const statuses: Application["status"][] = ["Pending Review", "Approved", "Rejected", "Approved", "Pending Review"];
  const wards = ["Kilimani", "Westlands", "Kasarani", "Langata", "Dagoretti", "Embakasi", "Roysambu", "Starehe"];
  const subCounties = ["Westlands", "Kasarani", "Langata", "Dagoretti North", "Embakasi Central", "Starehe"];

  return Array.from({ length: 30 }, (_, i) => {
    const citizen = KENYAN_CITIZEN_NAMES[i % KENYAN_CITIZEN_NAMES.length];
    const isBusinessType = i % 3 === 0;
    return {
      id: `APP-2026-${String(i + 1).padStart(3, "0")}`,
      applicant: `${citizen.first} ${citizen.last}`,
      applicantId: citizen.id,
      applicantEmail: generateEmail(citizen.first, citizen.last),
      applicantPhone: generatePhone(),
      service: services[i % services.length],
      date: generateDateStr(Math.floor(Math.random() * 60)),
      status: statuses[i % statuses.length],
      amount: [5000, 8500, 12000, 15000, 25000, 42500, 50000, 3000][i % 8],
      businessName: isBusinessType ? KENYAN_COMPANIES[i % KENYAN_COMPANIES.length] : undefined,
      ward: wards[i % wards.length],
      subCounty: subCounties[i % subCounties.length],
      address: `Plot ${100 + i}/${200 + i}, ${wards[i % wards.length]}`,
      type: isBusinessType ? "business" : "citizen",
    };
  });
}

function seedTenders(): Tender[] {
  const titles = [
    "Construction of Market Stalls — Phase II",
    "Supply of Pharmaceutical Commodities",
    "Road Rehabilitation — Ward 4 Access Roads",
    "ICT Infrastructure Modernization",
    "Solid Waste Collection Services",
    "Water Pipeline Extension — Zone C",
    "Renovation of Sub-County Offices",
    "Supply of School Furniture",
    "Solar Street Lighting Installation",
    "Ambulance Procurement & Maintenance",
    "ECDE Classroom Construction",
    "County Referral Hospital Equipment",
  ];
  const statuses: Tender["status"][] = ["Open", "Evaluated", "Awarded", "Open", "Awarded", "Open"];
  return titles.map((title, i) => ({
    id: `TND-2026-${String(i + 1).padStart(3, "0")}`,
    title,
    entity: `${["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Machakos"][i % 6]} County`,
    value: [45000000, 120000000, 28000000, 15000000, 8500000, 35000000, 22000000, 6500000, 18000000, 95000000, 12000000, 78000000][i],
    status: statuses[i % statuses.length],
    deadline: generateDateStr(-Math.floor(Math.random() * 30 + 5)),
    awardedTo: statuses[i % statuses.length] === "Awarded" ? KENYAN_COMPANIES[i % KENYAN_COMPANIES.length] : undefined,
  }));
}

function seedDepartments(): Department[] {
  return [
    { id: 1, name: "Trade & Industrialization", head: DEPARTMENT_HEADS[0].name, staff: 45, services: 12 },
    { id: 2, name: "Lands & Physical Planning", head: DEPARTMENT_HEADS[1].name, staff: 32, services: 8 },
    { id: 3, name: "Transport & Infrastructure", head: DEPARTMENT_HEADS[2].name, staff: 56, services: 5 },
    { id: 4, name: "Public Health & Sanitation", head: DEPARTMENT_HEADS[3].name, staff: 89, services: 15 },
    { id: 5, name: "Finance & Economic Planning", head: DEPARTMENT_HEADS[4].name, staff: 24, services: 3 },
    { id: 6, name: "Education & Social Services", head: DEPARTMENT_HEADS[5].name, staff: 67, services: 10 },
    { id: 7, name: "Agriculture & Livestock", head: DEPARTMENT_HEADS[6].name, staff: 38, services: 7 },
    { id: 8, name: "Water, Environment & Natural Resources", head: DEPARTMENT_HEADS[7].name, staff: 42, services: 6 },
  ];
}

function seedServices(): ServiceItem[] {
  return [
    { id: 1, name: "Single Business Permit", department: "Trade & Industrialization", fee: "Variable", status: "Active" },
    { id: 2, name: "Land Rates Clearance", department: "Lands & Physical Planning", fee: "Variable", status: "Active" },
    { id: 3, name: "Daily Parking", department: "Transport & Infrastructure", fee: "KES 200/day", status: "Active" },
    { id: 4, name: "Building Plan Approval", department: "Lands & Physical Planning", fee: "0.1% of cost", status: "Active" },
    { id: 5, name: "Food Hygiene License", department: "Public Health & Sanitation", fee: "KES 3,000", status: "Active" },
    { id: 6, name: "Liquor License", department: "Trade & Industrialization", fee: "KES 50,000", status: "Active" },
    { id: 7, name: "Advertising Signage Permit", department: "Trade & Industrialization", fee: "Variable", status: "Active" },
    { id: 8, name: "Fire Inspection Certificate", department: "Public Health & Sanitation", fee: "KES 4,500", status: "Active" },
    { id: 9, name: "Market Stall Allocation", department: "Trade & Industrialization", fee: "KES 500/month", status: "Active" },
    { id: 10, name: "Noise Permit", department: "Public Health & Sanitation", fee: "KES 2,000", status: "Draft" },
  ];
}

function seedNotifications(): Notification[] {
  return [
    {
      id: 1,
      title: "Application Approved",
      message: "Your Single Business Permit application (APP-2026-001) has been approved. Download your certificate from the dashboard.",
      type: "success",
      date: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: 2,
      title: "Payment Confirmed",
      message: "We received your M-Pesa payment of KES 15,000 for Application APP-2026-001. Ref: RK2190XS.",
      type: "info",
      date: new Date(Date.now() - 7200000).toISOString(),
      read: true,
    },
    {
      id: 3,
      title: "Document Required",
      message: "Please upload the missing KRA PIN certificate for your Land Rates application (APP-2026-005).",
      type: "warning",
      date: new Date(Date.now() - 86400000).toISOString(),
      read: false,
    },
    {
      id: 4,
      title: "Scheduled Maintenance",
      message: "The portal will undergo planned maintenance this Sunday from 2:00 AM to 6:00 AM EAT.",
      type: "info",
      date: new Date(Date.now() - 172800000).toISOString(),
      read: true,
    },
    {
      id: 5,
      title: "New Service Available",
      message: "Digital Fire Inspection Certificates are now available online. Apply through the Services Catalog.",
      type: "success",
      date: new Date(Date.now() - 259200000).toISOString(),
      read: false,
    },
  ];
}

function seedRevenueEntries(): RevenueEntry[] {
  const streams = ["Parking", "Market Fee", "Business Permit", "Fire Inspection", "Land Rates", "Liquor License", "Building Approval"];
  return Array.from({ length: 20 }, (_, i) => ({
    id: `REV-${Date.now()}-${i}`,
    ref: `RK${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    amount: [200, 50, 12500, 4500, 8000, 50000, 15000, 500, 3000, 25000][i % 10],
    user: `${streams[i % streams.length]} — ${KENYAN_CITIZEN_NAMES[i % KENYAN_CITIZEN_NAMES.length].first} ${KENYAN_CITIZEN_NAMES[i % KENYAN_CITIZEN_NAMES.length].last}`,
    stream: streams[i % streams.length],
    time: generateTimeStr(),
    reconciled: i % 5 !== 0,
  }));
}

function seedHealthDrugs(): HealthDrugItem[] {
  return [
    { id: 1, name: "Amoxicillin 500mg", facility: "Westlands Health Centre", stock: "24 units", level: "critical" },
    { id: 2, name: "Paracetamol Syrup", facility: "Pumwani Maternity Hospital", stock: "850 units", level: "high" },
    { id: 3, name: "Cetirizine 100ml", facility: "Kasarani Sub-County Hospital", stock: "12 units", level: "critical" },
    { id: 4, name: "Surgical Gloves (Latex)", facility: "City Hall Dispensary", stock: "1,200 pairs", level: "high" },
    { id: 5, name: "Metformin 500mg", facility: "Mbagathi District Hospital", stock: "45 units", level: "low" },
    { id: 6, name: "Artemether/Lumefantrine", facility: "Langata Health Centre", stock: "320 units", level: "high" },
  ];
}

function seedWelfarePrograms(): WelfareProgram[] {
  return [
    { id: 1, name: "Elderly Cash Transfer (Inua Jamii)", status: "Enrolled", date: "May 01, 2026", method: "Biometric" },
    { id: 2, name: "OVC Support Program", status: "Waitlist", date: "-", method: "Pending" },
    { id: 3, name: "PWD Disability Grant", status: "Active", date: "April 15, 2026", method: "Biometric" },
    { id: 4, name: "Cash for Youth (Kazi Mtaani)", status: "Active", date: "May 20, 2026", method: "M-Pesa" },
    { id: 5, name: "School Feeding Programme", status: "Enrolled", date: "May 10, 2026", method: "Institutional" },
  ];
}

function seedPetitions(): Petition[] {
  return [
    { id: 1, title: "Nairobi County Annual Budget 2026/27", deadline: "5 days", supporters: 4250, totalNeeded: 5000, category: "Budget" },
    { id: 2, title: "Westlands Urban Renewal Master Plan", deadline: "12 days", supporters: 1120, totalNeeded: 3000, category: "Planning" },
    { id: 3, title: "Kasarani Ward Road Maintenance Petition", deadline: "20 days", supporters: 680, totalNeeded: 2000, category: "Infrastructure" },
  ];
}

function seedLandRecords(): LandRecord[] {
  return [
    { id: "LR-001", action: "Block 0xF821 Validation", detail: "Parcel NAI/B112 verified via NLIMS bridge", status: "Success", hash: "0x82...a1f", timestamp: new Date().toISOString() },
    { id: "LR-002", action: "Ownership Transfer", detail: "Asset 209/45 transferred to new owner", status: "Immutable", hash: "0x3e...b42", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: "LR-003", action: "Anomaly Flagged", detail: "Suspicious transfer pattern on Plot 14/567", status: "Investigating", hash: "0x91...c99", timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: "LR-004", action: "Title Deed Issued", detail: "Digital certificate generated for LR/NAI/2026/892", status: "Verified", hash: "0xd4...f21", timestamp: new Date(Date.now() - 14400000).toISOString() },
  ];
}

function seedAnomalies(): AnomalyAlert[] {
  return [
    { id: 1, title: "Procurement Concentration Warning", description: "Savannah Infrastructure Ltd has won 85% of road tenders in Westlands sub-county over 6 months.", severity: "high", timestamp: new Date().toISOString(), dismissed: false },
    { id: 2, title: "Revenue Variance Detected", description: "Parking Zone A-12 daily collections dropped 40% week-over-week without seasonal justification.", severity: "medium", timestamp: new Date(Date.now() - 3600000).toISOString(), dismissed: false },
    { id: 3, title: "Duplicate Application Flagged", description: "Same KRA PIN used for two separate business permit applications within 24 hours.", severity: "high", timestamp: new Date(Date.now() - 7200000).toISOString(), dismissed: false },
  ];
}

// ─── Store Initialization ────────────────────────────────────────────
export function initializeStore() {
  if (typeof window === "undefined") return;
  if (!getStore("applications")) setStore("applications", seedApplications());
  if (!getStore("tenders")) setStore("tenders", seedTenders());
  if (!getStore("departments")) setStore("departments", seedDepartments());
  if (!getStore("services")) setStore("services", seedServices());
  if (!getStore("notifications")) setStore("notifications", seedNotifications());
  if (!getStore("revenue")) setStore("revenue", seedRevenueEntries());
  if (!getStore("health-drugs")) setStore("health-drugs", seedHealthDrugs());
  if (!getStore("welfare")) setStore("welfare", seedWelfarePrograms());
  if (!getStore("petitions")) setStore("petitions", seedPetitions());
  if (!getStore("land-records")) setStore("land-records", seedLandRecords());
  if (!getStore("anomalies")) setStore("anomalies", seedAnomalies());

  // Async sync from Supabase
  syncSupabaseData();
}

async function syncSupabaseData() {
  try {
    const { data: apps } = await supabase.from('applications').select('*');
    if (apps && apps.length > 0) {
      const mappedApps = apps.map(a => ({
        ...a,
        applicantId: a.applicant_id,
        applicantEmail: a.applicant_email,
        applicantPhone: a.applicant_phone,
        businessName: a.business_name,
        subCounty: a.sub_county,
      }));
      setStore("applications", mappedApps);
    }
    const { data: svcs } = await supabase.from('services').select('*');
    if (svcs && svcs.length > 0) setStore("services", svcs);

    const { data: tndrs } = await supabase.from('tenders').select('*');
    if (tndrs && tndrs.length > 0) {
      const mappedTndrs = tndrs.map(t => ({ ...t, awardedTo: t.awarded_to }));
      setStore("tenders", mappedTndrs);
    }

    const { data: depts } = await supabase.from('departments').select('*');
    if (depts && depts.length > 0) setStore("departments", depts);

    const { data: notifs } = await supabase.from('notifications').select('*');
    if (notifs && notifs.length > 0) setStore("notifications", notifs);

    const { data: revs } = await supabase.from('revenue').select('*');
    if (revs && revs.length > 0) setStore("revenue", revs);

    const { data: drugs } = await supabase.from('health_drugs').select('*');
    if (drugs && drugs.length > 0) setStore("health-drugs", drugs);

    const { data: welf } = await supabase.from('welfare').select('*');
    if (welf && welf.length > 0) setStore("welfare", welf);

    const { data: pets } = await supabase.from('petitions').select('*');
    if (pets && pets.length > 0) {
      const mappedPets = pets.map(p => ({ ...p, totalNeeded: p.total_needed }));
      setStore("petitions", mappedPets);
    }

    const { data: lands } = await supabase.from('land_records').select('*');
    if (lands && lands.length > 0) setStore("land-records", lands);

    const { data: anom } = await supabase.from('anomalies').select('*');
    if (anom && anom.length > 0) setStore("anomalies", anom);
  } catch (err) {
    console.error("Supabase sync failed:", err);
  }
}

// ─── CRUD Operations ─────────────────────────────────────────────────

// Applications
export function getApplications(): Application[] {
  return getStore<Application[]>("applications") ?? seedApplications();
}

export function getApplicationById(id: string): Application | undefined {
  return getApplications().find((a) => a.id === id);
}

export function addApplication(app: Omit<Application, "id" | "date" | "status">) {
  const apps = getApplications();
  const newApp: Application = {
    ...app,
    id: `APP-2026-${String(apps.length + 1).padStart(3, "0")}`,
    date: new Date().toISOString().split("T")[0],
    status: "Pending Review",
  };
  apps.unshift(newApp);
  setStore("applications", apps);
  emit("application:created", newApp);
  addNotification({
    title: "Application Submitted",
    message: `Your ${newApp.service} application (${newApp.id}) has been submitted successfully.`,
    type: "success",
  });
  
  // Async push to Supabase
  supabase.from('applications').insert({
    id: newApp.id,
    applicant: newApp.applicant,
    applicant_id: newApp.applicantId,
    applicant_email: newApp.applicantEmail,
    applicant_phone: newApp.applicantPhone,
    service: newApp.service,
    date: newApp.date,
    status: newApp.status,
    amount: newApp.amount,
    business_name: newApp.businessName,
    ward: newApp.ward,
    sub_county: newApp.subCounty,
    address: newApp.address,
    type: newApp.type
  }).then(({error}) => { if (error) console.error("Failed to insert app:", error); });

  return newApp;
}

export function updateApplicationStatus(id: string, status: Application["status"]) {
  const apps = getApplications();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx !== -1) {
    apps[idx].status = status;
    setStore("applications", apps);
    emit("application:updated", apps[idx]);
    addNotification({
      title: `Application ${status}`,
      message: `Application ${id} has been ${status.toLowerCase()}.`,
      type: status === "Approved" ? "success" : status === "Rejected" ? "error" : "info",
    });

    // Async push to Supabase
    supabase.from('applications').update({ status }).eq('id', id)
      .then(({error}) => { if (error) console.error("Failed to update app status:", error); });
  }
}

// Tenders
export function getTenders(): Tender[] {
  return getStore<Tender[]>("tenders") ?? seedTenders();
}

export function addTender(tender: Omit<Tender, "id">) {
  const tenders = getTenders();
  const newTender: Tender = {
    ...tender,
    id: `TND-2026-${String(tenders.length + 1).padStart(3, "0")}`,
  };
  tenders.unshift(newTender);
  setStore("tenders", tenders);
  emit("tender:created", newTender);

  supabase.from('tenders').insert({
    id: newTender.id,
    title: newTender.title,
    entity: newTender.entity,
    value: newTender.value,
    status: newTender.status,
    deadline: newTender.deadline,
    awarded_to: newTender.awardedTo
  }).then(({error}) => { if (error) console.error("Failed to insert tender:", error); });

  return newTender;
}

export function removeTender(id: string) {
  const tenders = getTenders().filter((t) => t.id !== id);
  setStore("tenders", tenders);
  emit("tender:removed", { id });
}

// Departments
export function getDepartments(): Department[] {
  return getStore<Department[]>("departments") ?? seedDepartments();
}

export function addDepartment(dept: Omit<Department, "id">) {
  const depts = getDepartments();
  const newDept: Department = { ...dept, id: Date.now() };
  depts.push(newDept);
  setStore("departments", depts);
  emit("department:created", newDept);

  supabase.from('departments').insert({
    name: newDept.name,
    head: newDept.head,
    staff: newDept.staff,
    services: newDept.services
  }).then(({error}) => { if (error) console.error("Failed to insert dept:", error); });

  return newDept;
}

export function updateDepartment(id: number, updates: Partial<Department>) {
  const depts = getDepartments();
  const idx = depts.findIndex((d) => d.id === id);
  if (idx !== -1) {
    depts[idx] = { ...depts[idx], ...updates };
    setStore("departments", depts);

    supabase.from('departments').update({
      name: depts[idx].name,
      head: depts[idx].head,
      staff: depts[idx].staff,
      services: depts[idx].services
    }).eq('id', id).then(({error}) => { if (error) console.error("Failed to update dept:", error); });
  }
}

export function removeDepartment(id: number) {
  const depts = getDepartments().filter((d) => d.id !== id);
  setStore("departments", depts);
  emit("department:removed", { id });
}

// Services
export function getServices(): ServiceItem[] {
  return getStore<ServiceItem[]>("services") ?? seedServices();
}

export function addService(svc: Omit<ServiceItem, "id">) {
  const svcs = getServices();
  const newSvc: ServiceItem = { ...svc, id: Date.now() };
  svcs.push(newSvc);
  setStore("services", svcs);

  // Async push to Supabase
  supabase.from('services').insert({
    id: newSvc.id,
    name: newSvc.name,
    department: newSvc.department,
    fee: newSvc.fee,
    status: newSvc.status
  }).then(({error}) => { if (error) console.error("Failed to insert service:", error); });

  return newSvc;
}

export function updateService(id: number, updates: Partial<ServiceItem>) {
  const svcs = getServices();
  const idx = svcs.findIndex((s) => s.id === id);
  if (idx !== -1) {
    svcs[idx] = { ...svcs[idx], ...updates };
    setStore("services", svcs);

    // Async push to Supabase
    supabase.from('services').update({
      name: svcs[idx].name,
      department: svcs[idx].department,
      fee: svcs[idx].fee,
      status: svcs[idx].status
    }).eq('id', id).then(({error}) => { if (error) console.error("Failed to update service:", error); });
  }
}

export function removeService(id: number) {
  const svcs = getServices().filter((s) => s.id !== id);
  setStore("services", svcs);
}

// Notifications
export function getNotifications(): Notification[] {
  return getStore<Notification[]>("notifications") ?? seedNotifications();
}

export function addNotification(notif: Omit<Notification, "id" | "date" | "read">) {
  const notifs = getNotifications();
  const newNotif: Notification = {
    ...notif,
    id: Date.now(),
    date: new Date().toISOString(),
    read: false,
  };
  notifs.unshift(newNotif);
  setStore("notifications", notifs);
  emit("notification:new", newNotif);

  supabase.from('notifications').insert({
    title: newNotif.title,
    message: newNotif.message,
    type: newNotif.type,
    date: newNotif.date,
    read: newNotif.read
  }).then(({error}) => { if (error) console.error("Failed to insert notif:", error); });

  return newNotif;
}

export function markNotificationRead(id: number) {
  const notifs = getNotifications();
  const idx = notifs.findIndex((n) => n.id === id);
  if (idx !== -1) {
    notifs[idx].read = true;
    setStore("notifications", notifs);
  }
}

export function markAllNotificationsRead() {
  const notifs = getNotifications().map((n) => ({ ...n, read: true }));
  setStore("notifications", notifs);
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.read).length;
}

// Revenue
export function getRevenueEntries(): RevenueEntry[] {
  return getStore<RevenueEntry[]>("revenue") ?? seedRevenueEntries();
}

export function addRevenueEntry(entry: Omit<RevenueEntry, "id">) {
  const entries = getRevenueEntries();
  const newEntry: RevenueEntry = { ...entry, id: `REV-${Date.now()}` };
  entries.unshift(newEntry);
  setStore("revenue", entries);
  emit("revenue:new", newEntry);

  supabase.from('revenue').insert({
    id: newEntry.id,
    ref: newEntry.ref,
    amount: newEntry.amount,
    "user": newEntry.user,
    stream: newEntry.stream,
    time: newEntry.time,
    reconciled: newEntry.reconciled
  }).then(({error}) => { if (error) console.error("Failed to insert revenue:", error); });

  return newEntry;
}

// Health Drugs
export function getHealthDrugs(): HealthDrugItem[] {
  return getStore<HealthDrugItem[]>("health-drugs") ?? seedHealthDrugs();
}

export function updateDrugStock(id: number, updates: Partial<HealthDrugItem>) {
  const drugs = getHealthDrugs();
  const idx = drugs.findIndex((d) => d.id === id);
  if (idx !== -1) {
    drugs[idx] = { ...drugs[idx], ...updates };
    setStore("health-drugs", drugs);

    supabase.from('health_drugs').update({
      stock: drugs[idx].stock,
      level: drugs[idx].level
    }).eq('id', id).then(({error}) => { if (error) console.error("Failed to update drug:", error); });
  }
}

// Welfare
export function getWelfarePrograms(): WelfareProgram[] {
  return getStore<WelfareProgram[]>("welfare") ?? seedWelfarePrograms();
}

// Petitions
export function getPetitions(): Petition[] {
  return getStore<Petition[]>("petitions") ?? seedPetitions();
}

export function votePetition(id: number) {
  const petitions = getPetitions();
  const idx = petitions.findIndex((p) => p.id === id);
  if (idx !== -1) {
    petitions[idx].supporters += 1;
    setStore("petitions", petitions);
    emit("petition:voted", petitions[idx]);

    supabase.from('petitions').update({
      supporters: petitions[idx].supporters
    }).eq('id', id).then(({error}) => { if (error) console.error("Failed to update petition:", error); });
  }
}

// Land Records
export function getLandRecords(): LandRecord[] {
  return getStore<LandRecord[]>("land-records") ?? seedLandRecords();
}

// Anomalies
export function getAnomalies(): AnomalyAlert[] {
  return getStore<AnomalyAlert[]>("anomalies") ?? seedAnomalies();
}

export function dismissAnomaly(id: number) {
  const anomalies = getAnomalies();
  const idx = anomalies.findIndex((a) => a.id === id);
  if (idx !== -1) {
    anomalies[idx].dismissed = true;
    setStore("anomalies", anomalies);

    supabase.from('anomalies').update({ dismissed: true })
      .eq('id', id).then(({error}) => { if (error) console.error("Failed to dismiss anomaly:", error); });
  }
}

// ─── Live Simulation ─────────────────────────────────────────────────
const LIVE_ALERTS = [
  { title: "Revenue Collected", type: "success" as const, messages: [
    "KES 4,500 received — Parking Zone A-12, Westlands",
    "KES 12,500 received — Business Permit Renewal, Kasarani",
    "KES 200 received — Daily Parking, CBD Zone 3",
    "KES 50,000 received — Liquor License, Kilimani",
    "KES 3,000 received — Food Hygiene License, Eastleigh",
    "KES 8,000 received — Land Rates, Langata",
  ]},
  { title: "Transparency Update", type: "info" as const, messages: [
    "Budget allocation updated: Health Department +KES 2.4M",
    "Tender TND-2026-003 evaluation report published",
    "Q2 revenue report now available for public review",
    "County Assembly approved supplementary budget",
  ]},
  { title: "Anomaly Detected", type: "warning" as const, messages: [
    "Duplicate tender submission flagged: TND-2026-012",
    "Unusual parking revenue drop in Zone B — investigating",
    "Same KRA PIN used across 3 different permit applications",
  ]},
  { title: "System Alert", type: "info" as const, messages: [
    "M-Pesa reconciliation batch completed — 99.9% match rate",
    "KRA iTax bridge sync completed successfully",
    "42 health facilities reporting data in real-time",
  ]},
];

let liveInterval: ReturnType<typeof setInterval> | null = null;

export function startLiveSimulation() {
  if (liveInterval) return;
  liveInterval = setInterval(() => {
    const category = LIVE_ALERTS[Math.floor(Math.random() * LIVE_ALERTS.length)];
    const message = category.messages[Math.floor(Math.random() * category.messages.length)];
    emit("live:alert", {
      id: Date.now(),
      title: category.title,
      message,
      type: category.type,
      timestamp: new Date().toISOString(),
    });
  }, 18000 + Math.random() * 12000); // 18-30 seconds
}

export function stopLiveSimulation() {
  if (liveInterval) {
    clearInterval(liveInterval);
    liveInterval = null;
  }
}
