"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, Shield, LogOut, UserCog, MessageSquare } from "lucide-react";
import { logout } from "@/app/lib/actions/auth";

const NAV_ITEMS = [
  { href: "/admin",              label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/soldiers",     label: "Roster",       icon: Users },
  { href: "/admin/users",        label: "Users",        icon: UserCog },
  { href: "/admin/notifications", label: "Messages",     icon: MessageSquare },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col" style={{
      backgroundColor: "#0a0c08",
      borderRight: "1px solid #1c2014",
      minHeight: "calc(100vh - 64px)",
    }}>
      {/* Header */}
      <div className="p-5" style={{ borderBottom: "1px solid #1c2014" }}>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4" style={{ color: "#c9a128" }} />
          <span className="text-xs font-black tracking-widest uppercase" style={{ color: "#c9a128" }}>
            Admin Panel
          </span>
        </div>
        <p className="text-[10px] tracking-wider uppercase" style={{ color: "#6b6a58", fontFamily: "monospace" }}>
          RGRNET // RESTRICTED
        </p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded text-xs font-bold tracking-wider uppercase transition-colors"
              style={{
                backgroundColor: active ? "rgba(201,161,40,0.08)" : "transparent",
                color: active ? "#c9a128" : "#8a8870",
                border: active ? "1px solid rgba(201,161,40,0.15)" : "1px solid transparent",
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3" style={{ borderTop: "1px solid #1c2014" }}>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-3 rounded text-xs font-bold tracking-wider uppercase w-full transition-colors hover:bg-[#1c2014]"
            style={{ color: "#6b6a58" }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
