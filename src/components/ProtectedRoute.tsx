import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: "citizen" | "admin";
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!session) {
    // Not logged in
    return <Navigate to={`/login${role === "admin" ? "?role=admin" : ""}`} replace />;
  }

  // Superuser bypass
  if (session.user.email === "danielwanjalamachimbo@gmail.com") {
    return <>{children}</>;
  }

  // Retrieve role from user metadata, default to citizen
  const userRole = session.user.user_metadata?.role || "citizen";

  if (userRole !== role) {
    // Logged in but wrong role
    return <Navigate to={userRole === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return <>{children}</>;
}
