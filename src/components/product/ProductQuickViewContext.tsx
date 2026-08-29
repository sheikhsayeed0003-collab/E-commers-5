"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ProductQuickView } from "./ProductQuickView";

interface QuickViewContextValue {
  openQuickView: (slug: string) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextValue>({
  openQuickView: () => {},
  closeQuickView: () => {},
});

export function useQuickView() {
  return useContext(QuickViewContext);
}

export function ProductQuickViewProvider({ children }: { children: React.ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);

  const openQuickView = useCallback((productSlug: string) => {
    setSlug(productSlug);
  }, []);

  const closeQuickView = useCallback(() => {
    setSlug(null);
  }, []);

  useEffect(() => {
    if (slug) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuickView();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeQuickView]);

  return (
    <QuickViewContext.Provider value={{ openQuickView, closeQuickView }}>
      {children}
      {slug && <ProductQuickView slug={slug} onClose={closeQuickView} />}
    </QuickViewContext.Provider>
  );
}
