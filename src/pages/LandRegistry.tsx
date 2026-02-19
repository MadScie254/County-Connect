import { DashboardLayout } from "@/components/DashboardLayout";
import { Map, ShieldCheck, Search, FileText, History, Lock, List, LayoutGrid } from "lucide-react";
import { useState } from "react";

export default function LandRegistry() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  return (
    <DashboardLayout role="citizen">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Digital Land Registry</h2>
            <p className="text-gray-500">Secure, transparent, and immutable property records.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-xs font-medium">
              <ShieldCheck className="w-4 h-4" />
              Secured by Blockchain
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Property Ownership</h3>
          <p className="text-gray-500 mb-6 max-w-lg mx-auto">Enter a Title Number to instantly verify ownership status, encumbrances, and history from the immutable ledger.</p>
          
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Enter Title Number (e.g., NAI/BLOCK/123/456)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 shadow-sm text-lg"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-emerald-600 text-white px-6 rounded-full font-medium hover:bg-emerald-700 transition-colors">
              Search
            </button>
          </div>
        </div>

        {viewMode === "list" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <LayoutGrid className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">My Properties</h3>
                <p className="text-sm text-gray-500">View and manage your registered properties and land rates.</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                  <History className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Transfer History</h3>
                <p className="text-sm text-gray-500">View historical ownership transfers and encumbrances.</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fraud Detection</h3>
                <p className="text-sm text-gray-500">Report suspicious activity or verify official signatures.</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Recent Registry Activity</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { action: "Title Deed Search", detail: "NAI/BLOCK/82/112", date: "Today, 10:23 AM", status: "Verified" },
                  { action: "Land Rate Payment", detail: "KES 12,500 for Plot 209/45", date: "Yesterday", status: "Completed" },
                  { action: "Official Search Request", detail: "Pending approval", date: "15 Feb 2024", status: "Processing" },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-full text-gray-500">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.action}</p>
                        <p className="text-xs text-gray-500">{item.detail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.status === 'Verified' || item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {item.status}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gray-100 rounded-xl border border-gray-200 h-[600px] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1200/800')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
            <div className="relative z-10 text-center bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg max-w-md mx-4">
              <Map className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Map View</h3>
              <p className="text-gray-600 mb-6">
                Visualize land parcels, zoning regulations, and public amenities directly on the map. 
                (Integration with GIS systems required)
              </p>
              <button className="px-6 py-2 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors">
                Launch Full Map
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
