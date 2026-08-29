"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "./ui/Toast";
import { ProductQuickViewProvider } from "./product/ProductQuickViewContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <ProductQuickViewProvider>{children}</ProductQuickViewProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
