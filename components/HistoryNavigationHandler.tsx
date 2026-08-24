"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function HistoryNavigationHandler() {
  const router = useRouter();

  useEffect(() => {
    const handlePopState = () => {
      // Refresh the route state on browser history navigation (back/forward & trackpad swipe)
      // to ensure the target route component mounts cleanly without stale router cache.
      router.refresh();
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        router.refresh();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [router]);

  return null;
}
