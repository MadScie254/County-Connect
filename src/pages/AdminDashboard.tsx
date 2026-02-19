import { DashboardLayout } from "@/components/DashboardLayout";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, FileText, TrendingUp, AlertTriangle, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const revenueData = [
  { name: "Jan", amount: 4000000 },
  { name: "Feb", amount: 3000000 },
  { name: "Mar", amount: 2000000 },
  { name: "Apr", amount: 2780000 },
  { name: "May", amount: 1890000 },
  { name: "Jun", amount: 2390000 },
  { name: "Jul", amount: 3490000 },
];

const applicationStats = [
  { name: "Mon", approved: 40, rejected: 24, pending: 24 },
  { name: "Tue", approved: 30, rejected: 13, pending: 22 },
  { name: "Wed", approved: 20, rejected: 58, pending: 22 },
  { name: "Thu", approved: 27, rejected: 39, pending: 20 },
  { name: "Fri", approved: 18, rejected: 48, pending: 21 },
  { name: "Sat", approved: 23, rejected: 38, pending: 25 },
  { name: "Sun", approved: 34, rejected: 43, pending: 21 },
];

const recentApplications = [
  {
    id: "APP-2024-001",
    applicant: "John Doe",
    service: "Single Business Permit",
    date: "2024-02-18",
    status: "Pending Review",
    amount: 15000,
  },
  {
    id: "APP-2024-002",
    applicant: "Jane Smith",
    service: "Land Rates Payment",
    date: "2024-02-18",
    status: "Approved",
    amount: 5000,
  },
  {
    id: "APP-2024-003",
    applicant: "Acme Construction",
    service: "Building Plan Approval",
    date: "2024-02-17",
    status: "Rejected",
    amount: 25000,
  },
  {
    id: "APP-2024-004",
    applicant: "City Cafe",
    service: "Food Hygiene License",
    date: "2024-02-17",
    status: "Pending Review",
    amount: 1000,
  },
  {
    id: "APP-2024-005",
    applicant: "Metro Trans",
    service: "Seasonal Parking",
    date: "2024-02-16",
    status: "Approved",
    amount: 3000,
  },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">County Overview</h2>
          <div className="flex gap-2">
            <select className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
              Export Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">KES 24.5M</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              <span className="font-bold mr-1">+12.5%</span> from last month
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">1,245</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              <span className="font-bold mr-1">+4.3%</span> from last month
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">45</div>
            <p className="text-xs text-gray-500 mt-1">Requires action</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Active Businesses</h3>
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">8,902</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              <span className="font-bold mr-1">+2.1%</span> new registrations
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-6">Revenue Collection Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }} 
                    tickFormatter={(value) => `K${value / 1000000}M`}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#059669" 
                    strokeWidth={3} 
                    dot={{ fill: '#059669', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Applications Status Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-6">Application Status</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationStats} barGap={0}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="approved" fill="#059669" radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="pending" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span> Approved
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span> Pending
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-full bg-red-500"></span> Rejected
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Applications</h3>
            <Link to="/admin/applications" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center">
              View All <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Application ID</th>
                  <th className="px-6 py-3">Applicant</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{app.id}</td>
                    <td className="px-6 py-4 text-gray-600">{app.applicant}</td>
                    <td className="px-6 py-4 text-gray-600">{app.service}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(app.date)}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{formatCurrency(app.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        app.status === 'Pending Review' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/admin/applications/${app.id}`}
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
