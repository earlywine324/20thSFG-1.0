import { createClient } from "@/app/lib/supabase/server";
import { Users, FileText, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats
  const [soldiers, applications] = await Promise.all([
    supabase.from("soldiers").select("id, status"),
    supabase.from("applications").select("id, status"),
  ]);

  const totalSoldiers = soldiers.data?.filter((s) => s.status === "ACTIVE DUTY").length ?? 0;
  const vacantBillets = soldiers.data?.filter((s) => s.status === "VACANT").length ?? 0;
  const pendingApps = applications.data?.filter((a) => a.status === "PENDING").length ?? 0;
  const totalApps = applications.data?.length ?? 0;

  const stats = [
    { label: "Active Soldiers", value: totalSoldiers, icon: Users, color: "#4ade80" },
    { label: "Vacant Billets", value: vacantBillets, icon: Users, color: "#c9a128" },
    { label: "Pending Applications", value: pendingApps, icon: Clock, color: "#f59e0b" },
    { label: "Total Applications", value: totalApps, icon: FileText, color: "#8a8870" },
  ];

  // Recent applications
  const { data: recentApps } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-black tracking-[0.35em] uppercase mb-2" style={{ color: "#c9a128" }}>
          Admin Dashboard
        </p>
        <h1 className="text-3xl font-black" style={{ color: "#e8e4d8" }}>Command Overview</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-lg p-5" style={{
            backgroundColor: "#0f120a",
            border: "1px solid #1c2014",
          }}>
            <div className="flex items-center justify-between mb-3">
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <p className="text-3xl font-black mb-1" style={{ color }}>{value}</p>
            <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: "#6b6a58" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #1c2014" }}>
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: "#8a8870" }}>
              Recent Applications
            </span>
            <Link href="/admin/applications" className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#c9a128" }}>
              View All →
            </Link>
          </div>
          <div className="divide-y divide-[#1c2014]">
            {(!recentApps || recentApps.length === 0) ? (
              <div className="p-5 text-center">
                <p className="text-xs" style={{ color: "#6b6a58" }}>No applications yet.</p>
              </div>
            ) : (
              recentApps.map((app) => (
                <Link key={app.id} href={`/admin/applications/${app.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-[#090b07] transition-colors">
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#e8e4d8" }}>{app.callsign}</p>
                    <p className="text-[10px]" style={{ color: "#6b6a58" }}>{app.discord_username}</p>
                  </div>
                  <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded" style={{
                    color: app.status === "PENDING" ? "#f59e0b" : app.status === "APPROVED" ? "#4ade80" : "#ef4444",
                    backgroundColor: app.status === "PENDING" ? "rgba(245,158,11,0.08)" : app.status === "APPROVED" ? "rgba(74,222,128,0.08)" : "rgba(239,68,68,0.08)",
                  }}>
                    {app.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid #1c2014" }}>
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: "#8a8870" }}>
              Quick Actions
            </span>
          </div>
          <div className="p-5 space-y-3">
            {[
              { href: "/admin/applications", label: "Review Pending Applications", icon: FileText, desc: `${pendingApps} awaiting review` },
              { href: "/admin/soldiers", label: "Manage Roster", icon: Users, desc: `${totalSoldiers} active, ${vacantBillets} vacant` },
              { href: "/admin/soldiers/new", label: "Add New Soldier", icon: CheckCircle, desc: "Fill a vacant billet" },
            ].map(({ href, label, icon: Icon, desc }) => (
              <Link key={href} href={href} className="flex items-center gap-4 p-4 rounded-lg hover:bg-[#090b07] transition-colors" style={{ border: "1px solid #1c2014" }}>
                <div className="w-10 h-10 rounded flex items-center justify-center" style={{
                  backgroundColor: "rgba(201,161,40,0.08)",
                  border: "1px solid rgba(201,161,40,0.15)",
                }}>
                  <Icon className="w-5 h-5" style={{ color: "#c9a128" }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#e8e4d8" }}>{label}</p>
                  <p className="text-[10px]" style={{ color: "#6b6a58" }}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
