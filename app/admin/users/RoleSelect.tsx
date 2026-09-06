"use client";

import { useState, useTransition } from "react";
import { setUserRole, type ProfileRole } from "@/app/lib/actions/users";
import { Loader2, Check } from "lucide-react";

const ROLES: { value: ProfileRole; label: string; color: string; bg: string; border: string }[] = [
  { value: "member",      label: "Member",      color: "#8b949e", bg: "rgba(139,148,158,.12)", border: "rgba(139,148,158,.2)" },
  { value: "admin",       label: "Admin",       color: "#d29922", bg: "rgba(210,153,34,.12)",  border: "rgba(210,153,34,.22)" },
  { value: "superadmin",  label: "Superadmin",  color: "#f85149", bg: "rgba(248,81,73,.12)",   border: "rgba(248,81,73,.22)" },
];

export default function RoleSelect({ userId, currentRole }: { userId: string; currentRole: ProfileRole }) {
  const [role, setRole]         = useState<ProfileRole>(currentRole);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleChange(next: ProfileRole) {
    if (next === role) return;
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await setUserRole(userId, next);
      if (res.error) {
        setError(res.error);
      } else {
        setRole(next);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  const current = ROLES.find(r => r.value === role)!;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex rounded overflow-hidden" style={{ border: "1px solid #21262d" }}>
        {ROLES.map(r => {
          const active = role === r.value;
          return (
            <button
              key={r.value}
              onClick={() => handleChange(r.value)}
              disabled={pending}
              className="px-3 py-1.5 text-[10px] font-black tracking-wider uppercase transition-all disabled:opacity-50"
              style={{
                background: active ? r.bg : "transparent",
                color:      active ? r.color : "#484f58",
                borderRight: "1px solid #21262d",
              }}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: current.color }} />}
      {saved   && <Check   className="w-3.5 h-3.5"              style={{ color: "#3fb950" }} />}
      {error   && <span className="text-[10px] font-mono" style={{ color: "#f85149" }}>{error}</span>}
    </div>
  );
}
