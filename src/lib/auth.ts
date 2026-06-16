// Authentication & Role Management

export interface UserSession {
  role: "citizen" | "admin";
  countySlug: string;
  name: string;
  email: string;
  idNumber?: string;
  department?: string;
}

const SESSION_KEY = "countyconnect:session";

export function login(session: UserSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  
  // Also set the selected county for legacy compatibility
  localStorage.setItem("countyconnect:selected-county", session.countySlug);
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentSession() !== null;
}

export function isAdmin(): boolean {
  const session = getCurrentSession();
  return session !== null && session.role === "admin";
}

export function isCitizen(): boolean {
  const session = getCurrentSession();
  return session !== null && session.role === "citizen";
}
