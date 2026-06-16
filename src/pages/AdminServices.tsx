import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useState } from "react";

type ServiceItem = {
  id: number;
  name: string;
  department: string;
  fee: string;
  status: string;
};

const initialServices: ServiceItem[] = [
  { id: 1, name: "Single Business Permit", department: "Trade", fee: "Variable", status: "Active" },
  { id: 2, name: "Land Rates", department: "Lands", fee: "Variable", status: "Active" },
  { id: 3, name: "Parking", department: "Transport", fee: "Fixed", status: "Active" },
  { id: 4, name: "Building Approval", department: "Planning", fee: "Variable", status: "Active" },
  { id: 5, name: "Food Hygiene", department: "Health", fee: "Fixed", status: "Active" },
];

export default function AdminServices() {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);

  const handleAddService = () => {
    const serviceName = window.prompt("Service name", "County Service");

    if (!serviceName) {
      return;
    }

    const departmentName = window.prompt("Owning department", "General Administration") ?? "General Administration";

    setServices((currentServices: ServiceItem[]) => [
      ...currentServices,
      {
        id: Date.now(),
        name: serviceName,
        department: departmentName,
        fee: "Variable",
        status: "Draft",
      },
    ]);
  };

  const handleEditService = (serviceId: number) => {
    const currentService = services.find((service: ServiceItem) => service.id === serviceId);

    if (!currentService) {
      return;
    }

    const updatedName = window.prompt("Update service name", currentService.name);

    if (!updatedName) {
      return;
    }

    setServices((currentServices: ServiceItem[]) => currentServices.map((service: ServiceItem) => service.id === serviceId ? { ...service, name: updatedName } : service));
  };

  const handleDeleteService = (serviceId: number) => {
    const currentService = services.find((service: ServiceItem) => service.id === serviceId);

    if (!currentService) {
      return;
    }

    const isConfirmed = window.confirm(`Remove ${currentService.name}?`);

    if (!isConfirmed) {
      return;
    }

    setServices((currentServices: ServiceItem[]) => currentServices.filter((service: ServiceItem) => service.id !== serviceId));
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Services Management</h2>
            <p className="text-gray-500">Manage the services offered to citizens.</p>
          </div>
          <button type="button" onClick={handleAddService} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search services..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Fee Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((service: ServiceItem) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{service.name}</td>
                  <td className="px-6 py-4 text-gray-600">{service.department}</td>
                  <td className="px-6 py-4 text-gray-600">{service.fee}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button type="button" onClick={() => handleEditService(service.id)} className="p-2 text-gray-400 hover:text-emerald-600" aria-label={`Edit ${service.name}`}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => handleDeleteService(service.id)} className="p-2 text-gray-400 hover:text-red-600" aria-label={`Delete ${service.name}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
