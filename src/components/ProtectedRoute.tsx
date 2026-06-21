import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: "citizen" | "admin";
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user) {
    // Not logged in
    return <Navigate to={`/login${role === "admin" ? "?role=admin" : ""}`} replace />;
  }

  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";

  if (role === "admin" && isAdmin) {
    return <>{children}</>;
  }

  // Non-admin users (citizen, business) only access citizen routes
  const mappedUserRole = "citizen" as const;

  if (mappedUserRole !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
