import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import LandingPage from "@/pages/LandingPage";
import CitizenDashboard from "@/pages/CitizenDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import ServiceCatalog from "@/pages/ServiceCatalog";
import ApplicationForm from "@/pages/ApplicationForm";
import ApplicationReview from "@/pages/ApplicationReview";
import ApplicationsList from "@/pages/ApplicationsList";
import AdminServices from "@/pages/AdminServices";
import AdminDepartments from "@/pages/AdminDepartments";
import AdminSettings from "@/pages/AdminSettings";
import ProcurementDashboard from "@/pages/ProcurementDashboard";
import TaxCompliance from "@/pages/TaxCompliance";
import LandRegistry from "@/pages/LandRegistry";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import UserProfile from "@/pages/UserProfile";
import Notifications from "@/pages/Notifications";
import SocialWelfare from "@/pages/SocialWelfare";
import CitizenEngagement from "@/pages/CitizenEngagement";
import RevenueCollection from "@/pages/RevenueCollection";
import ApiHub from "@/pages/ApiHub";
import ExecutiveAnalytics from "@/pages/ExecutiveAnalytics";
import PublicHealth from "@/pages/PublicHealth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LiveAlerts } from "@/components/LiveAlerts";
import { AuthProvider } from "@/context/AuthContext";

export default function App() {
  useEffect(() => {
    // Supabase will now handle all data reactively
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Citizen Routes */}
        <Route path="/dashboard" element={<ProtectedRoute role="citizen"><CitizenDashboard /></ProtectedRoute>} />
        <Route path="/applications/new" element={<ProtectedRoute role="citizen"><ServiceCatalog /></ProtectedRoute>} />
        <Route path="/apply/:serviceId" element={<ProtectedRoute role="citizen"><ApplicationForm /></ProtectedRoute>} />
        <Route path="/tax-compliance" element={<ProtectedRoute role="citizen"><TaxCompliance /></ProtectedRoute>} />
        <Route path="/land-registry" element={<ProtectedRoute role="citizen"><LandRegistry /></ProtectedRoute>} />
        <Route path="/social-welfare" element={<ProtectedRoute role="citizen"><SocialWelfare /></ProtectedRoute>} />
        <Route path="/engagement" element={<ProtectedRoute role="citizen"><CitizenEngagement /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute role="citizen"><UserProfile /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute role="citizen"><Notifications /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><ExecutiveAnalytics /></ProtectedRoute>} />
        <Route path="/admin/applications" element={<ProtectedRoute role="admin"><ApplicationsList /></ProtectedRoute>} />
        <Route path="/admin/applications/:id" element={<ProtectedRoute role="admin"><ApplicationReview /></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute role="admin"><AdminServices /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute role="admin"><AdminDepartments /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />
        <Route path="/admin/procurement" element={<ProtectedRoute role="admin"><ProcurementDashboard /></ProtectedRoute>} />
        <Route path="/admin/revenue" element={<ProtectedRoute role="admin"><RevenueCollection /></ProtectedRoute>} />
        <Route path="/admin/welfare" element={<ProtectedRoute role="admin"><SocialWelfare /></ProtectedRoute>} />
        <Route path="/admin/health" element={<ProtectedRoute role="admin"><PublicHealth /></ProtectedRoute>} />
        <Route path="/admin/api-hub" element={<ProtectedRoute role="admin"><ApiHub /></ProtectedRoute>} />

        {/* Redirects/Fallbacks */}
        <Route path="/applications" element={<Navigate to="/dashboard" />} />
        <Route path="/payments" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <LiveAlerts />
      </BrowserRouter>
    </AuthProvider>
  );
}
