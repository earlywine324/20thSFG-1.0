import { createClient } from "@/app/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ApplicationActions from "./actions";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: app } = await supabase.from("applications").select("*").eq("id", id).single();

  if (!app) notFound();

  const fields = [
    { label: "Callsign", value: app.callsign },
    { label: "Age", value: app.age },
    { label: "Discord", value: app.discord_username },
    { label: "Timezone", value: app.timezone },
    { label: "Milsim Hours", value: app.arma_hours },
    { label: "MOS Preference", value: app.mos_preference },
    { label: "Prior Units", value: app.prior_units || "None" },
    { label: "Availability", value: Array.isArray(app.availability) ? app.availability.join(", ") : app.availability || "Not specified" },
    { label: "Referred By", value: app.referred_by || "None" },
    { label: "Submitted", value: new Date(app.created_at).toLocaleString() },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "#f59e0b",
    APPROVED: "#4ade80",
    DENIED: "#ef4444",
  };

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/applications" className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-6" style={{ color: "#8a8870" }}>
        <ArrowLeft className="w-4 h-4" /> Back to Applications
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2" style={{ color: "#e8e4d8" }}>{app.callsign}</h1>
          <p className="text-xs" style={{ color: "#6b6a58" }}>Application ID: {app.id}</p>
        </div>
        <span className="text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded" style={{
          color: statusColors[app.status] || "#8a8870",
          backgroundColor: `${statusColors[app.status] || "#8a8870"}14`,
          border: `1px solid ${statusColors[app.status] || "#8a8870"}33`,
        }}>
          {app.status}
        </span>
      </div>

      {/* Details */}
      <div className="rounded-lg overflow-hidden mb-6" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
        <div className="px-5 py-3" style={{ borderBottom: "1px solid #1c2014" }}>
          <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: "#8a8870" }}>
            Application Details
          </span>
        </div>
        <div className="divide-y divide-[#1c2014]">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3">
              <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: "#6b6a58" }}>{label}</span>
              <span className="text-sm" style={{ color: "#e8e4d8" }}>{String(value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Motivation */}
      <div className="rounded-lg overflow-hidden mb-8" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
        <div className="px-5 py-3" style={{ borderBottom: "1px solid #1c2014" }}>
          <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: "#8a8870" }}>
            Statement of Intent
          </span>
        </div>
        <div className="p-5">
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#8a8870" }}>{app.motivation}</p>
        </div>
      </div>

      {/* Admin Notes */}
      {app.admin_notes && (
        <div className="rounded-lg overflow-hidden mb-8" style={{ backgroundColor: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)" }}>
          <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(239,68,68,0.1)" }}>
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: "#ef4444" }}>
              Admin Notes
            </span>
          </div>
          <div className="p-5">
            <p className="text-sm" style={{ color: "#8a8870" }}>{app.admin_notes}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      {app.status === "PENDING" && <ApplicationActions id={app.id} />}
    </div>
  );
}
