
import { supabase } from "./supabase";
import type { Application, Tender, Department, Petition, HealthDrugItem, ServiceItem } from "./types";

export async function addApplication(app: Partial<Application>) {
  const newApp = { ...app, id: `APP-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`, date: new Date().toISOString().split("T")[0], status: "Pending Review" };
  await supabase.from('applications').insert(newApp);
  return newApp;
}

export async function updateApplicationStatus(id: string, status: string) {
  await supabase.from('applications').update({ status }).eq('id', id);
}

export async function addRevenueEntry(entry: any) {
  await supabase.from('revenue').insert({ ...entry, id: `REV-${Date.now()}` });
}

export async function addDepartment(dept: Partial<Department>) {
  await supabase.from('departments').insert(dept);
}

export async function addService(svc: Partial<ServiceItem>) {
  await supabase.from('services').insert(svc);
}

export async function updateService(id: number, updates: Partial<ServiceItem>) {
  await supabase.from('services').update(updates).eq('id', id);
}

export async function removeService(id: number) {
  await supabase.from('services').delete().eq('id', id);
}

export async function votePetition(id: number) {
  // Simple RPC or just read/write logic for now
  const { data } = await supabase.from('petitions').select('supporters').eq('id', id).single();
  if (data) {
    await supabase.from('petitions').update({ supporters: data.supporters + 1 }).eq('id', id);
  }
}

export async function markAllNotificationsRead() {
  await supabase.from('notifications').update({ read: true }).eq('read', false);
}

export async function updateDrugStock(id: number, stock: string, level: string) {
  await supabase.from('health_drugs').update({ stock, level }).eq('id', id);
}

// Stubs for live simulation
export function startLiveSimulation() {}
export function stopLiveSimulation() {}
export function subscribe(event: string, callback: () => void) { return () => {}; }
