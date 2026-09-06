import { createClient } from "@/app/lib/supabase/server";
import Link from "next/link";
import { FileText } from "lucide-react";

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  const pending = applications?.filter((a) => a.status === "PENDING") ?? [];
  const reviewed = applications?.filter((a) => a.status !== "PENDING") ?? [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-[10px] font-black tracking-[0.35em] uppercase mb-2" style={{ color: "#c9a128" }}>
          Personnel Management
        </p>
        <h1 className="text-3xl font-black" style={{ color: "#e8e4d8" }}>Enlistment Applications</h1>
      </div>

      {/* Pending */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#f59e0b" }} />
          <h2 className="text-sm font-black tracking-widest uppercase" style={{ color: "#f59e0b" }}>
            Pending Review ({pending.length})
          </h2>
        </div>
        {pending.length === 0 ? (
          <div className="rounded-lg p-8 text-center" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
            <FileText className="w-8 h-8 mx-auto mb-3" style={{ color: "#6b6a58" }} />
            <p className="text-xs" style={{ color: "#6b6a58" }}>No pending applications.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pending.map((app) => (
              <ApplicationRow key={app.id} app={app} />
            ))}
          </div>
        )}
      </div>

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div>
          <h2 className="text-sm font-black tracking-widest uppercase mb-4" style={{ color: "#8a8870" }}>
            Reviewed ({reviewed.length})
          </h2>
          <div className="space-y-2">
            {reviewed.map((app) => (
              <ApplicationRow key={app.id} app={app} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ApplicationRow({ app }: { app: Record<string, string> }) {
  const statusColors: Record<string, { color: string; bg: string }> = {
    PENDING: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
    APPROVED: { color: "#4ade80", bg: "rgba(74,222,128,0.08)" },
    DENIED: { color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
  };
  const sc = statusColors[app.status] || statusColors.PENDING;

  return (
    <Link
      href={`/admin/applications/${app.id}`}
      className="flex items-center gap-5 px-5 py-4 rounded-lg hover:bg-[#090b07] transition-colors"
      style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <p className="text-sm font-bold" style={{ color: "#e8e4d8" }}>{app.callsign}</p>
          <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded" style={{
            color: sc.color, backgroundColor: sc.bg,
          }}>{app.status}</span>
        </div>
        <p className="text-xs" style={{ color: "#6b6a58" }}>
          {app.discord_username} &middot; {app.timezone} &middot; {app.mos_preference} &middot; {app.arma_hours} hrs
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[10px]" style={{ color: "#6b6a58" }}>
          {new Date(app.created_at).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
