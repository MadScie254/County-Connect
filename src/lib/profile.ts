export interface CitizenProfile {
  fullName: string;
  firstName: string;
  lastName: string;
  initials: string;
  email: string;
  phone: string;
  idNumber: string;
  address: string;
  county: string;
  ward: string;
}

export const CURRENT_CITIZEN: CitizenProfile = {
  fullName: "Daniel Wanjala Machimbo",
  firstName: "Daniel",
  lastName: "Wanjala Machimbo",
  initials: "DWM",
  email: "daniel.wanjala@county.go.ke",
  phone: "0712 345 678",
  idNumber: "12345678",
  address: "P.O. Box 12345, Nairobi",
  county: "Nairobi City County",
  ward: "Kilimani",
};
