export type LocalRole = "admin" | "seller" | "user";

export type LocalSession = {
  role: LocalRole;
  email: string;
  name: string;
};

export const LOCAL_SESSION_KEY = "alpaca_session";

const credentials: Record<LocalRole, { email: string; password: string; name: string }> = {
  admin: { email: "admin@alpaca.com", password: "admin123", name: "Alpaca Admin" },
  seller: { email: "seller@alpaca.com", password: "seller123", name: "Alpaca Seller" },
  user: { email: "user@alpaca.com", password: "user123", name: "Alpaca User" },
};

export const signInLocal = (role: LocalRole, email: string, password: string) => {
  const account = credentials[role];

  if (email.trim().toLowerCase() !== account.email || password !== account.password) {
    return null;
  }

  const session: LocalSession = { role, email: account.email, name: account.name };
  window.localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
  window.localStorage.setItem("role", role);
  window.localStorage.setItem("email", account.email);
  return session;
};

export const getLocalSession = () => {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(LOCAL_SESSION_KEY);
    return stored ? (JSON.parse(stored) as LocalSession) : null;
  } catch {
    return null;
  }
};

export const hasLocalRole = (role: LocalRole) => {
  const session = getLocalSession();
  return session?.role === role || window.localStorage.getItem("role") === role;
};

export const clearLocalSession = () => {
  window.localStorage.removeItem(LOCAL_SESSION_KEY);
  window.localStorage.removeItem("role");
  window.localStorage.removeItem("email");
};
