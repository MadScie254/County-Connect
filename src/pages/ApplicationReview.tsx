import { DashboardLayout } from "@/components/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  MapPin, 
  User, 
  Building2, 
  Calendar,
  Download,
  ChevronLeft
} from "lucide-react";
import { useState } from "react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useSupabase } from "@/hooks/useSupabase";
import type { Application, Tender, RevenueEntry, AnomalyAlert, LandRecord, Petition, WelfareProgram, HealthDrugItem, Notification, Department, ServiceItem } from "@/lib/types";
import { supabase } from "@/lib/supabase";

// Documents are mocked for demonstration purposes
const mockDocuments = [
  { name: "Business Registration.pdf", size: "2.4 MB" },
  { name: "KRA PIN Certificate.pdf", size: "1.1 MB" },
  { name: "Identity Document.pdf", size: "3.5 MB" },
];

export default function ApplicationReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const applicationData = getApplicationById(id || "");
  
  const [isProcessing, setIsProcessing] = useState(false);

  if (!applicationData) {
    return (
      <DashboardLayout role="admin">
        <div className="p-12 text-center text-gray-500">Application not found.</div>
      </DashboardLayout>
    );
  }

  const handleAction = (newStatus: "Approved" | "Rejected" | "Changes Requested") => {
    setIsProcessing(true);
    setTimeout(() => {
      updateApplicationStatus(applicationData.id, newStatus);
      setIsProcessing(false);
      navigate("/admin/applications");
    }, 1000);
  };

  const handleDownload = (fileName: string) => {
    const payload = `County Connect document download\n\nApplication: ${applicationData.id}\nDocument: ${fileName}\nApplicant: ${applicationData.applicant}\nGenerated: ${new Date().toISOString()}`;
    const blob = new Blob([payload], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            type="button"
            onClick={() => navigate("/admin")}
            aria-label="Back to applications list"
            title="Back to applications list"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="sr-only">Back to applications list</span>
            <ChevronLeft className="w-6 h-6 text-gray-500" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">Application #{applicationData.id}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                applicationData.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                applicationData.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                applicationData.status === 'Changes Requested' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                'bg-blue-50 text-blue-700 border-blue-100'
              }`}>
                {applicationData.status}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Submitted on {formatDate(applicationData.date)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Details */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Applicant Information</h3>
              </div>
              <div className="p-6 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="font-medium text-gray-900">{applicationData.applicant}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">ID Number</p>
                  <p className="font-medium text-gray-900">{applicationData.applicantId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                  <p className="font-medium text-gray-900">{applicationData.applicantPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="font-medium text-gray-900">{applicationData.applicantEmail}</p>
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Business Details</h3>
              </div>
              <div className="p-6 grid grid-cols-2 gap-6">
                {applicationData.type === "business" && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Business Name</p>
                      <p className="font-medium text-gray-900">{applicationData.businessName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Registration No.</p>
                      <p className="font-medium text-gray-900">BN-123456</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Service Type</p>
                  <p className="font-medium text-gray-900">{applicationData.service}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Location</p>
                  <p className="font-medium text-gray-900">{applicationData.ward}, {applicationData.subCounty}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Physical Address</p>
                  <p className="font-medium text-gray-900">{applicationData.address || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Submitted Documents</h3>
              </div>
              <div className="p-6 space-y-3">
                {mockDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 rounded text-red-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.size}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleDownload(doc.name)} aria-label={`Download ${doc.name}`} title={`Download ${doc.name}`} className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                      <span className="sr-only">Download {doc.name}</span>
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* Payment Status */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Payment Status</h3>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 text-sm">Amount Paid</span>
                  <span className="font-bold text-xl text-gray-900">{formatCurrency(applicationData.amount)}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Method</span>
                    <span className="font-medium text-gray-900">M-Pesa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reference</span>
                    <span className="font-medium text-gray-900 font-mono">SDF123456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                      Paid
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <button
                  type="button"
                  onClick={() => handleAction("Approved")}
                  disabled={isProcessing || applicationData.status === "Approved"}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isProcessing && applicationData.status === "Approved" ? "Processing..." : "Approve Application"}
                </button>
                <button
                  type="button"
                  onClick={() => handleAction("Rejected")}
                  disabled={isProcessing || applicationData.status === "Rejected"}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Application
                </button>
                <button
                  type="button"
                  onClick={() => handleAction("Changes Requested")}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  Request Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
