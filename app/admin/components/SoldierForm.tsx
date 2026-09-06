"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertSoldier } from "@/app/lib/actions/soldiers";
import { Save } from "lucide-react";

const STATUSES = ["ACTIVE DUTY", "RESERVE", "LOA", "DISCHARGED", "VACANT"];

const STAFF_SECTIONS = [
  { value: "S1 - Recruiting and Retention",       label: "S1 — Recruiting & Retention" },
  { value: "S2 - Intelligence",                   label: "S2 — Intelligence" },
  { value: "S3 - Force Improvement Group",        label: "S3 — Force Improvement Group" },
  { value: "S4 - Base Maintenance Operations",    label: "S4 — Base Maintenance" },
  { value: "S4 - Combat Imaging & Documentation", label: "S4 — Combat Imaging" },
  { value: "S6 - Public Affairs Office",          label: "S6 — Public Affairs" },
];

const QUAL_OPTIONS = [
  "SF Tab", "Sapper Tab", "Airborne", "HALO",
  "Air Assault", "CIB", "EIB", "Combat Diver", "SOCM",
  "Demo", "JTAC", "Pathfinder",
];

const inputClass = "w-full px-4 py-3 rounded text-sm outline-none";
const inputStyle = { backgroundColor: "#090b07", border: "1px solid #1c2014", color: "#e8e4d8" };
const labelClass = "block text-[10px] font-black tracking-widest uppercase mb-2";
const labelStyle = { color: "#6b6a58" };

type SoldierData = Record<string, string | string[] | null | undefined>;

type Prefill = {
  role?: string;
  unit?: string;
  team?: string;
  billetId?: string;
};

type UserOption = {
  id: string;
  label: string;
  email: string;
};

export default function SoldierForm({
  soldier,
  isNew,
  prefill,
  userOptions = [],
}: {
  soldier?: SoldierData;
  isNew?: boolean;
  prefill?: Prefill;
  userOptions?: UserOption[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setError("");
    formData.set("_isNew", isNew ? "true" : "false");
    const result = await upsertSoldier(formData);
    if (result.error) {
      setError(result.error);
      setSaving(false);
    } else {
      // If we came from a billet assign link, auto-assign then go back
      if (prefill?.billetId && result.id) {
        const { assignSoldierToBillet } = await import("@/app/lib/actions/soldiers");
        await assignSoldierToBillet(result.id as string, prefill.billetId);
      }
      router.push("/admin/soldiers");
      router.refresh();
    }
  }

  const s = soldier || {};
  const quals = (s.quals as string[]) || [];
  const staffTeams = (s.staff_teams as string[]) || [];

  return (
    <form action={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Identity */}
      <Section title="Identity & Rank">
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Soldier ID *" name="id" defaultValue={s.id as string} required readOnly={!isNew} />
          <Field label="Rank (Abbr) *" name="rank" defaultValue={s.rank as string} required placeholder="SSG" />
          <Field label="Rank (Full) *" name="rankFull" defaultValue={s.rank_full as string} required placeholder="Staff Sergeant" />
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Field label="Full Name *" name="name" defaultValue={s.name as string} required placeholder="John Doe" />
          <Field label="Callsign" name="callsign" defaultValue={s.callsign as string} placeholder="Ghost-6" />
          <Field label="Positional Callsign" name="positionalCallsign" defaultValue={s.positional_callsign as string} placeholder="1-1" />
        </div>
      </Section>

      {/* Position */}
      <Section title="Assignment">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="MOS Code *" name="mos" defaultValue={s.mos as string} required placeholder="18B" />
          <Field label="MOS Title *" name="mosTitle" defaultValue={s.mos_title as string} required placeholder="Weapons Sergeant" />
          <Field label="Role / Position *" name="role" defaultValue={(s.role as string) || prefill?.role} required placeholder="Senior Weapons Sergeant" />
          <div>
            <label className={labelClass} style={labelStyle}>Status *</label>
            <select name="status" required className={inputClass} style={inputStyle} defaultValue={s.status as string || "ACTIVE DUTY"}>
              {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
          <Field label="Unit *" name="unit" defaultValue={(s.unit as string) || prefill?.unit} required placeholder="20th Special Forces Group" />
          <Field label="Team" name="team" defaultValue={(s.team as string) || prefill?.team} placeholder="1st Squad" />
        </div>
      </Section>

      {/* Service */}
      <Section title="Service Details">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Enlist Date" name="enlistDate" defaultValue={s.enlist_date as string} placeholder="15 MAR 2026" />
          <Field label="Last Promotion" name="lastPromotion" defaultValue={s.last_promotion as string} placeholder="01 APR 2026" />
          <Field label="Time in Service" name="timeInService" defaultValue={s.time_in_service as string} placeholder="6 months" />
          <Field label="Time in Grade" name="timeInGrade" defaultValue={s.time_in_grade as string} placeholder="3 months" />
          <Field label="Avatar Code" name="avatar" defaultValue={s.avatar as string || "RCT"} placeholder="18B" />
        </div>
      </Section>

      {/* Contact */}
      <Section title="Contact & Activity">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Discord ID" name="discordId" defaultValue={s.discord_id as string} placeholder="username#0000" />
          <Field label="Timezone" name="timezone" defaultValue={s.timezone as string} placeholder="EST" />
        </div>
        <div className="mt-4 p-4 rounded" style={{ backgroundColor: "#0a0d08", border: "1px solid #1c2014" }}>
          <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: "#6b6a58" }}>
            Linked Account
          </p>
          <p className="text-[10px] mb-3" style={{ color: "#4a4838" }}>
            Once linked, Last Active updates on every login and the soldier can receive notifications.
          </p>
          {userOptions.length > 0 ? (
            <div>
              <label className={labelClass} style={labelStyle}>Select Account</label>
              <select
                name="userId"
                defaultValue={(s.user_id as string) || ""}
                className={inputClass}
                style={inputStyle}
              >
                <option value="">— Not linked —</option>
                {userOptions.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}{u.email && u.email !== u.label ? ` (${u.email})` : ""}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <Field label="User ID" name="userId" defaultValue={s.user_id as string} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
          )}
        </div>
      </Section>

      {/* Qualifications */}
      <Section title="Qualifications">
        <div className="flex flex-wrap gap-3">
          {QUAL_OPTIONS.map((q) => (
            <label key={q} className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer text-xs" style={{
              backgroundColor: "#0f120a", border: "1px solid #1c2014", color: "#8a8870",
            }}>
              <input type="checkbox" name="quals" value={q} defaultChecked={quals.includes(q)} className="accent-[#c9a128]" />
              {q}
            </label>
          ))}
        </div>
      </Section>

      {/* Staff Assignments */}
      <Section title="Staff Assignments">
        <p className="text-[10px] mb-4" style={{ color: "#484f58" }}>
          Select any additional administrative positions this soldier holds alongside their primary billet.
        </p>
        <div className="flex flex-wrap gap-3">
          {STAFF_SECTIONS.map((sec) => (
            <label key={sec.value} className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer text-xs font-bold" style={{
              backgroundColor: "#0f120a", border: "1px solid #1c2014", color: "#8a8870",
            }}>
              <input
                type="checkbox"
                name="staffTeams"
                value={sec.value}
                defaultChecked={staffTeams.includes(sec.value)}
                className="accent-[#c9a128]"
              />
              {sec.label}
            </label>
          ))}
        </div>
      </Section>

      {/* Error */}
      {error && (
        <div className="p-4 rounded" style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <p className="text-xs font-black tracking-widest uppercase" style={{ color: "#ef4444" }}>ERROR: {error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 px-8 py-4 rounded text-sm font-black tracking-widest uppercase disabled:opacity-50"
        style={{ backgroundColor: "#c9a128", color: "#090b07" }}
      >
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : isNew ? "Create Soldier" : "Save Changes"}
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg p-6" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
      <h3 className="text-xs font-black tracking-widest uppercase mb-5 pb-3" style={{ color: "#8a8870", borderBottom: "1px solid #1c2014" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, name, defaultValue, required, readOnly, placeholder }: {
  label: string; name: string; defaultValue?: string; required?: boolean; readOnly?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className={labelClass} style={labelStyle}>{label}</label>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue || ""}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`${inputClass} ${readOnly ? "opacity-50" : ""}`}
        style={inputStyle}
      />
    </div>
  );
}
