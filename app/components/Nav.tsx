"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Shield, LogIn, LogOut, ChevronUp } from "lucide-react";
import { createClient } from "@/app/lib/supabase/client";
import NotificationBell from "./NotificationBell";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Streamers", href: "/streamers" },
];

const MILHQ_LINKS = [
  { label: "Roster", href: "/roster" },
  { label: "Operations", href: "/operations" },
  { label: "Ranks", href: "/milhq/ranks" },
  { label: "Awards", href: "/milhq/awards" },
  { label: "Qualifications", href: "/milhq/qualifications" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [milhqOpen, setMilhqOpen] = useState(false);
  const [mobileMilhqOpen, setMobileMilhqOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; isAdmin?: boolean } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isMilhqActive =
    pathname.startsWith("/milhq") ||
    pathname.startsWith("/roster") ||
    pathname.startsWith("/operations");

  // Check auth state
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user: u } }) => {
      if (u) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", u.id)
          .single();
        const isRealAdmin = !!(profile && ["admin", "superadmin"].includes(profile.role));
        // Respect the preview-role cookie: if a real admin is previewing as
        // guest or member, hide admin-only UI so they see what others see.
        const previewCookie = document.cookie
          .split("; ")
          .find(row => row.startsWith("preview-role="))
          ?.split("=")[1];
        const effectiveRole = isRealAdmin && previewCookie ? previewCookie : (isRealAdmin ? "admin" : "member");
        setUser({
          email: u.email,
          isAdmin: effectiveRole === "admin",
        });
      } else {
        setUser(null);
      }
    });
  }, [pathname]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMilhqOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setMilhqOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{
      borderBottom: "1px solid #161b27",
      backgroundColor: "#07090e",
      backgroundImage: `
        radial-gradient(ellipse 30% 100% at 0% 50%, #0d1018 0%, transparent 100%),
        radial-gradient(ellipse 30% 100% at 100% 50%, #0c1020 0%, transparent 100%)
      `,
    }}>
      {/* Blue accent top stripe */}
      <div style={{
        height: "2px",
        background: "linear-gradient(90deg, #07090e 0%, rgba(77,182,224,0.2) 20%, #4db6e0 50%, rgba(77,182,224,0.2) 80%, #07090e 100%)"
      }} />

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo-new.png"
            alt="1/75th RGR Logo"
            width={36}
            height={36}
            className="shrink-0 drop-shadow-lg"
            style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }}
          />
          <div className="flex flex-col leading-none">
            <span className="font-black text-sm tracking-widest uppercase" style={{ color: "#e8edf5" }}>
              1/75<span style={{ color: "#4db6e0" }}>th</span> RGR
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#8892a4" }}>Outlaws · Bellum</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 text-xs font-bold tracking-widest uppercase rounded transition-all"
                style={{
                  color: active ? "#4db6e0" : "#8892a4",
                  backgroundColor: active ? "rgba(77,182,224,0.08)" : "transparent",
                  borderBottom: active ? "2px solid #4db6e0" : "2px solid transparent",
                }}
              >
                {label}
              </Link>
            );
          })}

          {/* Mil HQ dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMilhqOpen((v) => !v)}
              className="flex items-center gap-1 px-4 py-2 text-xs font-bold tracking-widest uppercase rounded transition-all"
              style={{
                color: isMilhqActive ? "#4db6e0" : "#8892a4",
                backgroundColor: isMilhqActive ? "rgba(77,182,224,0.08)" : "transparent",
                borderBottom: isMilhqActive ? "2px solid #4db6e0" : "2px solid transparent",
              }}
            >
              Mil HQ
              <ChevronDown className={`w-3 h-3 transition-transform ${milhqOpen ? "rotate-180" : ""}`} />
            </button>

            {milhqOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-lg overflow-hidden shadow-xl" style={{
                backgroundColor: "#0c0f17",
                border: "1px solid #161b27",
              }}>
                {MILHQ_LINKS.map(({ label, href }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className="block px-4 py-3 text-xs font-bold tracking-widest uppercase transition-colors"
                      style={{
                        color: active ? "#4db6e0" : "#8892a4",
                        backgroundColor: active ? "rgba(77,182,224,0.05)" : "transparent",
                        borderBottom: "1px solid #161b27",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(77,182,224,0.05)"; e.currentTarget.style.color = "#4db6e0"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = active ? "rgba(77,182,224,0.05)" : "transparent"; e.currentTarget.style.color = active ? "#4db6e0" : "#8892a4"; }}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* CTA + Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Vote */}
          <a
            href="https://milsimunits.com/unit/1-75thrr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase px-3 py-2 rounded transition-all"
            style={{
              color: "#fbbf24",
              backgroundColor: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.3)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(251,191,36,0.18)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(251,191,36,0.08)"; }}
          >
            <ChevronUp className="w-3.5 h-3.5" />
            Vote
          </a>

          {/* Discord */}
          <a
            href="https://discord.gg/NDuQrF7S"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase px-3 py-2 rounded transition-all"
            style={{
              color: "#e0e2ff",
              backgroundColor: "rgba(88,101,242,0.12)",
              border: "1px solid rgba(88,101,242,0.3)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(88,101,242,0.22)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(88,101,242,0.12)"; }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.014.044.03.057a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Discord
          </a>

          {user?.isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase px-3 py-2 rounded transition-colors"
              style={{ color: "#4db6e0", backgroundColor: "rgba(77,182,224,0.08)", border: "1px solid rgba(77,182,224,0.18)" }}
            >
              <Shield className="w-3 h-3" /> Admin
            </Link>
          )}
          {user && <NotificationBell />}

          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-3 py-2 rounded transition-colors hover:bg-[#161b27]"
              style={{ color: "#505870" }}
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-3 py-2 rounded transition-colors hover:bg-[#161b27]"
              style={{ color: "#8892a4" }}
            >
              <LogIn className="w-3 h-3" /> Login
            </Link>
          )}
          {!user && (
            <Link
              href="/enlist"
              className="text-xs font-black tracking-widest uppercase px-5 py-2.5 rounded transition-colors"
              style={{
                backgroundColor: "#111827",
                color: "#4db6e0",
                border: "1px solid rgba(77,182,224,0.35)",
                boxShadow: "0 0 12px rgba(77,182,224,0.1)",
              }}
            >
              Enlist Now
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2"
          style={{ color: "#8892a4" }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-2" style={{
          borderTop: "1px solid #161b27",
          backgroundColor: "#07090e",
        }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-xs font-bold tracking-widest uppercase py-2"
              style={{
                color: pathname === href ? "#4db6e0" : "#8892a4",
                borderBottom: "1px solid #161b27",
              }}
            >
              {label}
            </Link>
          ))}

          {/* Mobile Mil HQ dropdown */}
          <button
            onClick={() => setMobileMilhqOpen((v) => !v)}
            className="flex items-center justify-between text-xs font-bold tracking-widest uppercase py-2"
            style={{
              color: isMilhqActive ? "#4db6e0" : "#8892a4",
              borderBottom: "1px solid #161b27",
            }}
          >
            Mil HQ
            <ChevronDown className={`w-3 h-3 transition-transform ${mobileMilhqOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileMilhqOpen && (
            <div className="pl-4 flex flex-col gap-1">
              {MILHQ_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-xs font-bold tracking-widest uppercase py-1.5"
                  style={{
                    color: pathname === href ? "#4db6e0" : "#505870",
                    borderBottom: "1px solid rgba(22,27,39,0.4)",
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}

          {user?.isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase py-2"
              style={{ color: "#4db6e0", borderBottom: "1px solid #161b27" }}
            >
              <Shield className="w-3 h-3" /> Admin Panel
            </Link>
          )}

          {user ? (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase py-2 w-full text-left"
              style={{ color: "#505870", borderBottom: "1px solid #161b27" }}
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase py-2"
              style={{ color: "#8892a4", borderBottom: "1px solid #161b27" }}
            >
              <LogIn className="w-3 h-3" /> Login
            </Link>
          )}

          {/* Vote — mobile */}
          <a
            href="https://milsimunits.com/unit/1-75thrr"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 text-xs font-black tracking-widest uppercase px-5 py-3 rounded"
            style={{ backgroundColor: "rgba(251,191,36,0.08)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}
          >
            <ChevronUp className="w-4 h-4" />
            Vote for Us on MilsimUnits
          </a>

          <a
            href="https://discord.gg/NDuQrF7S"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 text-xs font-black tracking-widest uppercase px-5 py-3 rounded"
            style={{ backgroundColor: "rgba(88,101,242,0.12)", color: "#e0e2ff", border: "1px solid rgba(88,101,242,0.3)" }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.014.044.03.057a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Join our Discord
          </a>

          {!user && (
            <Link
              href="/enlist"
              onClick={() => setMenuOpen(false)}
              className="mt-2 text-center text-xs font-black tracking-widest uppercase px-5 py-3 rounded"
              style={{ backgroundColor: "#111827", color: "#4db6e0", border: "1px solid rgba(77,182,224,0.35)" }}
            >
              Enlist Now
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
