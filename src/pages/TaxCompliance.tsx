import { DashboardLayout } from "@/components/DashboardLayout";
import { Calculator, Calendar, FileCheck, AlertCircle, DollarSign, PieChart as PieChartIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

export default function TaxCompliance() {
  const [revenue, setRevenue] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);

  const taxableIncome = Math.max(0, revenue - expenses);
  const estimatedTax = taxableIncome * 0.3; // Simplified 30% corporate tax

  return (
    <DashboardLayout role="citizen">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SME Tax Assistant</h2>
          <p className="text-gray-500">Simplify your tax compliance with KRA integration.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tax Calculator */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" /> Tax Liability Calculator
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Revenue (KES)</label>
                <input 
                  type="number" 
                  value={revenue || ''}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Expenses (KES)</label>
                <input 
                  type="number" 
                  value={expenses || ''}
                  onChange={(e) => setExpenses(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Taxable Income</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(taxableIncome)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Estimated Tax (30%)</p>
                <p className="text-xl font-bold text-emerald-600">{formatCurrency(estimatedTax)}</p>
              </div>
              <div className="flex items-center">
                <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700">
                  File Returns
                </button>
              </div>
            </div>
          </div>

          {/* Reminders & Status */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" /> Upcoming Deadlines
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="bg-white p-2 rounded text-center min-w-[50px]">
                    <span className="block text-xs text-gray-500 uppercase">JUN</span>
                    <span className="block text-lg font-bold text-blue-600">20</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">VAT Return</p>
                    <p className="text-xs text-gray-500">Monthly Value Added Tax</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="bg-white p-2 rounded text-center min-w-[50px]">
                    <span className="block text-xs text-gray-500 uppercase">JUN</span>
                    <span className="block text-lg font-bold text-amber-600">30</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Annual Income Tax</p>
                    <p className="text-xs text-gray-500">Corporate Tax Filing</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-purple-600" /> Compliance Status
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Tax Compliance Certificate</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">Valid</span>
              </div>
              <p className="text-xs text-gray-500">Expires on 31 Dec 2024</p>
              <button className="mt-4 w-full border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
