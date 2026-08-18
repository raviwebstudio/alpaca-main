export type AdminProfile = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string;
};

export const ADMIN_PROFILE_KEY = "alpaca_admin_profile";

export const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  firstName: "Alpaca",
  lastName: "Admin",
  username: "alpaca-admin",
  email: "admin@alpaca.com",
  phone: "9999999999",
  address: "ALPACA Studio, New Delhi, India",
  profileImage: "",
};

export const readAdminProfile = (): AdminProfile => {
  if (typeof window === "undefined") {
    return DEFAULT_ADMIN_PROFILE;
  }

  try {
    const stored = window.localStorage.getItem(ADMIN_PROFILE_KEY);
    return stored
      ? { ...DEFAULT_ADMIN_PROFILE, ...(JSON.parse(stored) as Partial<AdminProfile>) }
      : DEFAULT_ADMIN_PROFILE;
  } catch {
    return DEFAULT_ADMIN_PROFILE;
  }
};

export const saveAdminProfile = (profile: AdminProfile) => {
  window.localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(profile));
  window.localStorage.setItem("email", profile.email);
  window.dispatchEvent(new Event("alpaca-admin-profile-updated"));
};
