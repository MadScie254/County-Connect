import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Users, Building2 } from "lucide-react";
import { useState } from "react";

import { getDepartments, addDepartment } from "@/lib/store";

export default function AdminDepartments() {
  const [departments, setDepartments] = useState(getDepartments());

  const handleAddDepartment = () => {
    const departmentName = window.prompt("Department name", "New Department");

    if (!departmentName) {
      return;
    }

    const departmentHead = window.prompt("Department head", "County Officer") ?? "County Officer";

    addDepartment({
      name: departmentName,
      head: departmentHead,
      staff: 12,
      services: 1,
    });
    setDepartments(getDepartments());
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Departments</h2>
            <p className="text-gray-500">Manage county departments and personnel.</p>
          </div>
          <button type="button" onClick={handleAddDepartment} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
            <Plus className="w-4 h-4" /> Add Department
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                  <p className="text-sm text-gray-500">Head: {dept.head}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  {dept.staff} Staff
                </div>
                <div className="text-sm font-medium text-emerald-600">
                  {dept.services} Services
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
