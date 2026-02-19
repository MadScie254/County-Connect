import { DashboardLayout } from "@/components/DashboardLayout";
import { ArrowUpRight, Clock, FileCheck, AlertCircle, Plus, Building2, Globe, Car, HardHat } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "@/lib/utils";

// Mock Data
const applications = [
  {
    id: "APP-2024-001",
    service: "Single Business Permit",
    status: "Approved",
    date: "2024-02-15",
    amount: 15000,
  },
  {
    id: "APP-2024-002",
    service: "Land Rates Payment",
    status: "Pending",
    date: "2024-02-18",
    amount: 5000,
  },
  {
    id: "APP-2024-003",
    service: "Construction Permit",
    status: "Rejected",
    date: "2024-01-20",
    amount: 25000,
  },
];

const services = [
  { name: "Business Licensing", icon: Building2, desc: "Apply for or renew business permits" },
  { name: "Land Rates", icon: Globe, desc: "Pay annual land rates and obtain clearance" },
  { name: "Parking", icon: Car, desc: "Daily and seasonal parking payments" },
  { name: "Construction", icon: HardHat, desc: "Building plan approvals and permits" },
];

export default function CitizenDashboard() {
  return (
    <DashboardLayout role="citizen">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, John!</h2>
            <p className="text-gray-500">Here's what's happening with your applications.</p>
          </div>
          <Link
            to="/applications/new"
            className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Active Applications</h3>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">2</div>
            <p className="text-xs text-gray-500 mt-1">In progress</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Approved</h3>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <p className="text-xs text-gray-500 mt-1">Total approved permits</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Actions</h3>
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">1</div>
            <p className="text-xs text-gray-500 mt-1">Requires your attention</p>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            <Link to="/applications" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center">
              View All <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Application ID</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{app.id}</td>
                    <td className="px-6 py-4 text-gray-600">{app.service}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(app.date)}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{formatCurrency(app.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        app.status === 'Pending' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600 font-medium">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Services */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Popular Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <Link
                key={service.name}
                to={`/services/${service.name.toLowerCase().replace(" ", "-")}`}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
              >
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 transition-transform duration-200">
                  <service.icon className="w-6 h-6" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{service.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">{service.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
