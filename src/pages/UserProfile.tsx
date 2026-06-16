import { DashboardLayout } from "@/components/DashboardLayout";
import { User, Mail, Phone, MapPin, Save, Camera } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CURRENT_CITIZEN } from "@/lib/profile";

export default function UserProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [profile, setProfile] = useState(() => {
    if (typeof window === "undefined") {
      return CURRENT_CITIZEN;
    }

    const storedProfile = window.localStorage.getItem("countyconnect:citizen-profile");

    if (!storedProfile) {
      return CURRENT_CITIZEN;
    }

    try {
      return { ...CURRENT_CITIZEN, ...JSON.parse(storedProfile) };
    } catch {
      return CURRENT_CITIZEN;
    }
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (typeof window !== "undefined") {
      window.localStorage.setItem("countyconnect:citizen-profile", JSON.stringify(profile));
    }

    setSaveMessage("Profile saved locally for this browser session.");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));
    setSaveMessage(`Selected avatar: ${file.name}`);
  };

  return (
    <DashboardLayout role="citizen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-gray-500">Manage your personal information and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center h-fit">
            <div className="relative inline-block mb-4">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile avatar preview"
                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-3xl font-bold mx-auto border-4 border-white shadow-sm">
                  {profile.initials}
                </div>
              )}
              <button type="button" onClick={handleAvatarClick} className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 text-gray-500 hover:text-emerald-600">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{profile.fullName}</h3>
            <p className="text-gray-500 text-sm mb-4">Citizen ID: {profile.idNumber}</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
              Verified Citizen
            </div>
            <p className="mt-4 text-xs text-gray-500">{profile.ward}, {profile.county}</p>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Details</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" value={profile.firstName} onChange={(event) => setProfile((current) => ({ ...current, firstName: event.target.value, fullName: `${event.target.value} ${current.lastName}`.trim() }))} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" value={profile.lastName} onChange={(event) => setProfile((current) => ({ ...current, lastName: event.target.value, fullName: `${current.firstName} ${event.target.value}`.trim() }))} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="email" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="tel" value={profile.phone} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" value={profile.address} onChange={(event) => setProfile((current) => ({ ...current, address: event.target.value }))} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
              {saveMessage && <p className="mt-4 text-sm text-emerald-700">{saveMessage}</p>}
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
