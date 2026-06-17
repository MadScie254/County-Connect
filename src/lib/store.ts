import { useSupabase } from "@/hooks/useSupabase";
import type { 
  Application, Tender, RevenueEntry, AnomalyAlert, LandRecord, 
  Petition, WelfareProgram, HealthDrugItem, Notification, 
  Department, ServiceItem
} from "./types";

export * from "./types";
export * from "./mutations";

// Backward compatible hooks for components that haven't been refactored
export function getApplications() { return useSupabase<Application>("applications").data; }
export function getTenders() { return useSupabase<Tender>("tenders").data; }
export function getRevenueEntries() { return useSupabase<RevenueEntry>("revenue").data; }
export function getAnomalies() { return useSupabase<AnomalyAlert>("anomalies").data; }
export function getLandRecords() { return useSupabase<LandRecord>("land_records").data; }
export function getPetitions() { return useSupabase<Petition>("petitions").data; }
export function getWelfarePrograms() { return useSupabase<WelfareProgram>("welfare").data; }
export function getHealthDrugs() { return useSupabase<HealthDrugItem>("health_drugs").data; }
export function getNotifications() { return useSupabase<Notification>("notifications").data; }
export function getDepartments() { return useSupabase<Department>("departments").data; }
export function getServices() { return useSupabase<ServiceItem>("services").data; }

export function getApplicationById(id: string) {
  // Simple implementation, component will re-render
  return useSupabase<Application>("applications").data.find(a => a.id === id);
}

export function getUnreadCount() {
  const notifs = useSupabase<Notification>("notifications").data;
  return notifs ? notifs.filter(n => !n.read).length : 0;
}
