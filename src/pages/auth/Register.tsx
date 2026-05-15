import { ShieldCheck, Mail, Lock, User, ArrowRight, Loader2, Phone, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import {
  COUNTY_PROFILES,
  getCountyBySlug,
  getDefaultCounty,
  getSelectedCountySlug,
  setSelectedCounty,
} from "@/lib/counties";

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [countySlug, setCountySlug] = useState(getSelectedCountySlug());
  const selectedCounty = getCountyBySlug(countySlug) ?? getDefaultCounty();

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSelectedCounty(selectedCounty.slug);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/dashboard?county=${selectedCounty.slug}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <label htmlFor="register-county" className="block text-sm font-medium text-emerald-900 mb-2">
              County account
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600" />
              <select
                id="register-county"
                name="register-county"
                value={countySlug}
                onChange={(e) => setCountySlug(e.target.value)}
                className="w-full rounded-xl border border-emerald-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-gray-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                {COUNTY_PROFILES.map((county) => (
                  <option key={county.slug} value={county.slug}>
                    {county.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-emerald-800">
              New accounts inherit the chosen county profile for onboarding, pricing, and support routing.
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">Selected county</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{selectedCounty.name}</p>
            <p className="text-sm text-gray-500">{selectedCounty.region} region · {selectedCounty.tier} tier</p>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="07XX XXX XXX"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Register
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
