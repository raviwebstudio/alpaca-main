"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { navigation } from "@/lib/storefront";
import { useCart } from "@/components/storefront/cart-provider";
import { SITE_IMAGES } from "@/lib/siteImages";
import { useEffect, useState } from "react";

type StoredUser = {
  username?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

const fallbackUser: StoredUser = {
  username: "alpaca-user",
  name: "John Doe",
  email: "user@alpaca.com",
  phone: "9999999999",
  address: "Delhi",
};

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        return;
      } catch {
        localStorage.removeItem("user");
      }
    }

    if (role === "user") {
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      setUser(fallbackUser);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("alpaca_session");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("user");
    setUser(null);
    setProfileOpen(false);
    router.push("/login");
  };

  const initials = user?.name
    ? user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-background/80 backdrop-blur-xl">
      <div className="shell flex h-20 items-center justify-between gap-4">
        <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
          {/* <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-white text-sm font-bold text-dark shadow-soft">
            A
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-[0.28em] text-dark">ALPACA
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.32em] text-text-secondary">
              Made for the move
            </span>
          </div> */}
          <span className="flex items-center">
            <Image
              src={SITE_IMAGES.logo}
              alt="ALPACA Logo"
              width={2316}
              height={590}
              priority
              className="h-9 w-auto object-contain"
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-text-secondary md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "transition-colors duration-300 hover:text-dark",
                pathname === item.href && "text-dark",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative">
            {user ? (
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-sm font-semibold text-dark transition hover:-translate-y-0.5"
                aria-expanded={profileOpen}
                aria-label="Open user profile"
              >
                {initials}
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-dark transition hover:-translate-y-0.5"
                aria-label="Login"
              >
                <User className="h-4 w-4" />
              </Link>
            )}

            {profileOpen && user ? (
              <div className="absolute right-0 top-14 z-50 w-72 rounded-2xl border border-line bg-white p-5 text-sm shadow-soft">
                <div className="space-y-2 text-text-secondary">
                  <p className="text-base font-semibold text-dark">{user.name}</p>
                  <p>Username: {user.username ?? "alpaca-user"}</p>
                  <p>Name: {user.name}</p>
                  <p>Email: {user.email}</p>
                  <p>Phone: +91 {user.phone}</p>
                  <p>Address: {user.address}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-dark bg-dark px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>

          <Link
            href="/checkout/cart"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-dark transition-transform duration-300 hover:-translate-y-0.5"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Cart</span>
            <span className="rounded-full bg-dark px-2 py-0.5 text-[0.72rem] text-white">
              {itemCount}
            </span>
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-dark md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-background md:hidden"
          >
            <div className="shell flex flex-col gap-1 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={clsx(
                    "rounded-2xl px-4 py-3 text-sm font-medium text-text-secondary transition-colors duration-300 hover:bg-white hover:text-dark",
                    pathname === item.href && "bg-white text-dark",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
