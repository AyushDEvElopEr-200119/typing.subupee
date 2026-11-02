"use client";

import { useUI } from "@/lib/ui-store";

export function SignUpButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const openAuth = useUI((state) => state.openAuth);
  return (
    <button className={className} onClick={() => openAuth("signup")}>
      {children}
    </button>
  );
}
