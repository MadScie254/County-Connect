import { getNotifications, markAllNotificationsRead } from "@/lib/store";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Bell, CheckCircle2, AlertCircle, Info, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import type { Application, Tender, RevenueEntry, AnomalyAlert, LandRecord, Petition, WelfareProgram, HealthDrugItem, Notification, Department,  } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export default function Notifications() {
  const [items, setItems] = useState(getNotifications());

  const handleMarkAllAsRead = () => {
    markAllNotificationsRead();
    setItems(getNotifications());
  };

  return (
    <DashboardLayout role="citizen">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            <p className="text-gray-500">Stay updated on your applications and alerts.</p>
          </div>
          <button type="button" onClick={handleMarkAllAsRead} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            Mark all as read
          </button>
        </div>

        <div className="space-y-4">
          {items.map((notification) => (
            <div 
              key={notification.id} 
              className={`bg-white p-4 rounded-xl border transition-all ${
                notification.read ? "border-gray-200" : "border-emerald-200 shadow-sm bg-emerald-50/30"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  notification.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                  notification.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                   notification.type === 'warning' ? <AlertCircle className="w-5 h-5" /> :
                   <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${notification.read ? "text-gray-900" : "text-gray-900"}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notification.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {notification.message}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
