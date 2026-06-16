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
import { CURRENT_CITIZEN } from "@/lib/profile";

// Mock Data for a single application
const applicationData = {
  id: "APP-2024-001",
  service: "Single Business Permit",
  status: "Pending Review",
  submittedDate: "2024-02-18",
  applicant: {
    name: CURRENT_CITIZEN.fullName,
    idNumber: CURRENT_CITIZEN.idNumber,
    phone: CURRENT_CITIZEN.phone,
    email: CURRENT_CITIZEN.email,
  },
  business: {
    name: "Acme Traders Ltd",
    regNumber: "BN-123456",
    activity: "Retail Shop",
    address: "Plot 209/123, Moi Avenue",
    ward: "Kilimani",
    subCounty: "Westlands",
  },
  documents: [
    { name: "Business Registration.pdf", size: "2.4 MB" },
    { name: "KRA PIN Certificate.pdf", size: "1.1 MB" },
    { name: "Lease Agreement.pdf", size: "3.5 MB" },
  ],
  payment: {
    amount: 15000,
    method: "M-Pesa",
    ref: "SDF123456",
    status: "Paid",
  },
};

export default function ApplicationReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(applicationData.status);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = (newStatus: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setStatus(newStatus);
      setIsProcessing(false);
    }, 1500);
  };

  const handleDownload = (fileName: string) => {
    const payload = `CountyConnect document download\n\nApplication: ${applicationData.id}\nDocument: ${fileName}\nApplicant: ${applicationData.applicant.name}\nGenerated: ${new Date().toISOString()}`;
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
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="sr-only">Back to applications list</span>
            <ChevronLeft className="w-6 h-6 text-gray-500" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">Application #{id || applicationData.id}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                'bg-blue-50 text-blue-700 border-blue-100'
              }`}>
                {status}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Submitted on {formatDate(applicationData.submittedDate)}</p>
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
                  <p className="font-medium text-gray-900">{applicationData.applicant.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">ID Number</p>
                  <p className="font-medium text-gray-900">{applicationData.applicant.idNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                  <p className="font-medium text-gray-900">{applicationData.applicant.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="font-medium text-gray-900">{applicationData.applicant.email}</p>
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
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Business Name</p>
                  <p className="font-medium text-gray-900">{applicationData.business.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Registration No.</p>
                  <p className="font-medium text-gray-900">{applicationData.business.regNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Activity</p>
                  <p className="font-medium text-gray-900">{applicationData.business.activity}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Location</p>
                  <p className="font-medium text-gray-900">{applicationData.business.ward}, {applicationData.business.subCounty}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Physical Address</p>
                  <p className="font-medium text-gray-900">{applicationData.business.address}</p>
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
                {applicationData.documents.map((doc, idx) => (
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
                  <span className="font-bold text-xl text-gray-900">{formatCurrency(applicationData.payment.amount)}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Method</span>
                    <span className="font-medium text-gray-900">{applicationData.payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reference</span>
                    <span className="font-medium text-gray-900 font-mono">{applicationData.payment.ref}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                      {applicationData.payment.status}
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
                  disabled={isProcessing || status === "Approved"}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isProcessing && status === "Approved" ? "Processing..." : "Approve Application"}
                </button>
                <button
                  type="button"
                  onClick={() => handleAction("Rejected")}
                  disabled={isProcessing || status === "Rejected"}
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
