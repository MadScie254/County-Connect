import { DashboardLayout } from "@/components/DashboardLayout";
import { Search, ArrowRight, Building2, MapPin, Car, HardHat, Store, Utensils, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = ["All", "Business", "Land", "Construction", "Health", "Transport"];

const services = [
  {
    id: "sbp",
    name: "Single Business Permit",
    category: "Business",
    icon: Store,
    desc: "Required for all business outlets operating within the county.",
    fee: "From KES 5,000",
  },
  {
    id: "land-rates",
    name: "Land Rates Payment",
    category: "Land",
    icon: MapPin,
    desc: "Annual land rates payment for property owners.",
    fee: "Based on valuation",
  },
  {
    id: "parking",
    name: "Seasonal Parking",
    category: "Transport",
    icon: Car,
    desc: "Monthly or annual parking permits for PSVs and private vehicles.",
    fee: "KES 3,000 / month",
  },
  {
    id: "construction",
    name: "Building Plan Approval",
    category: "Construction",
    icon: HardHat,
    desc: "Approval for new construction or renovations.",
    fee: "Based on area",
  },
  {
    id: "food-hygiene",
    name: "Food Hygiene License",
    category: "Health",
    icon: Utensils,
    desc: "Medical examination and certification for food handlers.",
    fee: "KES 1,000",
  },
  {
    id: "liquor",
    name: "Liquor License",
    category: "Business",
    icon: Briefcase,
    desc: "License for selling alcoholic beverages.",
    fee: "KES 50,000",
  },
];

export default function ServiceCatalog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout role="citizen">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service Catalog</h2>
          <p className="text-gray-500">Select a service to start your application.</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for a service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  selectedCategory === category
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full group"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-gray-500 text-sm mb-4 flex-grow">{service.desc}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {service.fee}
                </span>
                <Link
                  to={`/apply/${service.id}`}
                  className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Apply Now <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No services found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
