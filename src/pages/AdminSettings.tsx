import { DashboardLayout } from "@/components/DashboardLayout";
import { Save } from "lucide-react";
import { getSelectedCounty } from "@/lib/counties";

export default function AdminSettings() {
  const selectedCounty = getSelectedCounty();

  return (
    <DashboardLayout role="admin">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-500">Configure global platform settings.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">General Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">County Name</label>
                  <input type="text" defaultValue={selectedCounty.name} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                  <input type="email" defaultValue="support@countyconnect.go.ke" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">M-Pesa Integration</p>
                    <p className="text-sm text-gray-500">Enable M-Pesa payments for services</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Card Payments</p>
                    <p className="text-sm text-gray-500">Enable credit/debit card processing</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="email-notif" className="rounded text-emerald-600 focus:ring-emerald-500" defaultChecked />
                  <label htmlFor="email-notif" className="text-sm text-gray-700">Send email notifications for application updates</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="sms-notif" className="rounded text-emerald-600 focus:ring-emerald-500" defaultChecked />
                  <label htmlFor="sms-notif" className="text-sm text-gray-700">Send SMS alerts for payment confirmations</label>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
