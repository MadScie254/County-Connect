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
  const [userRole, setUserRole] = useState<string>("citizen");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (data && data.role) {
      setUserRole(data.role);
    }
    setLoading(false);
  }

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
  if (session.user.email === "danielwanjalamachimbo@gmail.com" || userRole === "super_admin") {
    return <>{children}</>;
  }

  // Currently, the frontend role checks for "admin" (which we can map to county_admin) or "citizen"
  const mappedUserRole = userRole === "county_admin" || userRole === "admin" ? "admin" : "citizen";

  if (mappedUserRole !== role) {
    // Logged in but wrong role
    return <Navigate to={mappedUserRole === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return <>{children}</>;
}
