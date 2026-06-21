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

  // Superuser bypass
  if (user.email === "danielwanjalamachimbo@gmail.com" || profile?.role === "admin" || profile?.role === "super_admin") {
    return <>{children}</>;
  }

  // Currently, the frontend role checks for "admin" (which we can map to county_admin) or "citizen"
  const mappedUserRole = profile?.role === "admin" ? "admin" : "citizen";

  if (mappedUserRole !== role) {
    // Logged in but wrong role
    return <Navigate to={mappedUserRole === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return <>{children}</>;
}
