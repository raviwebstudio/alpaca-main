import type { ReactNode } from "react";
import { SiteHeader } from "@/components/storefront/site-header";
import Footer from "@/components/Footer";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(circle_at_top,_rgba(226,210,194,0.6),_transparent_42%),radial-gradient(circle_at_right_top,_rgba(255,255,255,0.92),_transparent_30%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[30rem] h-[520px] bg-[radial-gradient(circle_at_left,_rgba(238,227,216,0.7),_transparent_35%),radial-gradient(circle_at_right,_rgba(255,255,255,0.7),_transparent_28%)]" />
      <div className="relative">
        <SiteHeader />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
