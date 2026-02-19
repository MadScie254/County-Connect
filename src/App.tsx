import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Citizen Routes */}
        <Route path="/dashboard" element={<CitizenDashboard />} />
        <Route path="/applications/new" element={<ServiceCatalog />} />
        <Route path="/apply/:serviceId" element={<ApplicationForm />} />
        <Route path="/tax-compliance" element={<TaxCompliance />} />
        <Route path="/land-registry" element={<LandRegistry />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/applications" element={<ApplicationsList />} />
        <Route path="/admin/applications/:id" element={<ApplicationReview />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/departments" element={<AdminDepartments />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/procurement" element={<ProcurementDashboard />} />

        {/* Redirects/Fallbacks */}
        <Route path="/applications" element={<Navigate to="/dashboard" />} />
        <Route path="/payments" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
