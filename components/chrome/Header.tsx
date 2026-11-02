"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useUI } from "@/lib/ui-store";
import { Pressable } from "@/components/ui/Pressable";
import { LanguageMenu } from "@/components/curriculum/LanguagePicker";
import { ACCOUNTS_ENABLED } from "@/lib/features";
import { BrandLogo } from "./BrandLogo";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const links = [
  { href: "/learn", label: "Lessons", icon: icon("M4 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7z") },
  { href: "/tests", label: "Tests", icon: icon("M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z") },
  { href: "/games", label: "Games", icon: icon("M6 11h4M8 9v4M15 12h.01M18 10h.01M7 6h10a5 5 0 0 1 0 10l-1.5 2.5a2 2 0 0 1-3 0L11 16H7A5 5 0 0 1 7 6z") },
  { href: "/progress", label: "Progress", icon: icon("M4 20V10M10 20V4M16 20v-7M22 20H2") },
];

export function Header() {
  const pathname = usePathname();
  const openAuth = useUI((state) => state.openAuth);
  const openThemes = useUI((state) => state.openThemes);
  const openCurriculum = useUI((state) => state.openCurriculum);
  const session = authClient.useSession();
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = session.data?.user;

  useEffect(() => {
    function onPointer(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenu(false);
    }
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, []);

  return (
    <header className="site-header material no-print">
      <Link href="/" className="wordmark" aria-label="Subupee Typing home">
        <BrandLogo />
      </Link>
      <nav className="nav-links" aria-label="Primary">
        {links.map((link) =>
          link.href === "/learn" ? (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname.startsWith("/learn") || pathname.startsWith("/practice") ? "page" : undefined}
              onClick={() => openCurriculum()}
            >
              {link.icon}
              {link.label}
            </Link>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href || pathname.startsWith(`${link.href}/`) ? "page" : undefined}
            >
              {link.icon}
              {link.label}
            </Link>
          ),
        )}
      </nav>
      <div className="header-actions">
        <LanguageMenu />
        <Pressable size="small" tone="quiet" onClick={openThemes}>
          Themes
        </Pressable>
        {user ? (
          <div className="account" ref={menuRef}>
            <Pressable size="small" tone="plain" aria-expanded={menu} onClick={() => setMenu((open) => !open)}>
              {user.name || user.email}
            </Pressable>
            {menu && (
              <div className="account-menu material-strong">
                <Pressable
                  tone="quiet"
                  onClick={() => {
                    setMenu(false);
                    void authClient.signOut();
                  }}
                >
                  Log out
                </Pressable>
              </div>
            )}
          </div>
        ) : ACCOUNTS_ENABLED ? (
          <>
            <Pressable size="small" tone="plain" onClick={() => openAuth("login")}>
              Log in
            </Pressable>
            <Pressable size="small" tone="primary" onClick={() => openAuth("signup")}>
              Sign up
            </Pressable>
          </>
        ) : null}
      </div>
    </header>
  );
}
