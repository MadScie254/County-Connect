import { Navigate } from "react-router-dom";
import { getCurrentSession } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: "citizen" | "admin";
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const session = getCurrentSession();

  if (!session) {
    // Not logged in
    return <Navigate to={`/login${role === "admin" ? "?role=admin" : ""}`} replace />;
  }

  if (session.role !== role) {
    // Logged in but wrong role
    // Redirect to their respective dashboard
    return <Navigate to={session.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return <>{children}</>;
}
