import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { Clock, CheckCircle, XCircle, LogIn } from "lucide-react";
import EnlistClientPage, { type OpenBillet } from "./EnlistClientPage";

export default async function EnlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in — show login prompt
  if (!user) {
    return (
      <div className="bg-[#090b07] min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <LogIn className="w-12 h-12 mx-auto mb-6" style={{ color: "#c9a128" }} />
          <h1 className="text-2xl font-black mb-3" style={{ color: "#e8e4d8" }}>Account Required</h1>
          <p className="text-sm mb-8" style={{ color: "#8a8870" }}>
            You must create an account and log in before submitting an enlistment application.
          </p>
          <Link
            href="/login?redirect=/enlist"
            className="inline-flex items-center gap-2 px-8 py-3 rounded text-sm font-black tracking-widest uppercase"
            style={{ backgroundColor: "#c9a128", color: "#090b07" }}
          >
            <LogIn className="w-4 h-4" /> Log In / Create Account
          </Link>
        </div>
      </div>
    );
  }

  // Check if user already has an application
  const { data: existing } = await supabase
    .from("applications")
    .select("id, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (existing && existing.length > 0) {
    const app = existing[0];
    const date = new Date(app.created_at).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

    const statusConfig: Record<string, { icon: React.ReactNode; color: string; title: string; message: string }> = {
      PENDING: {
        icon: <Clock className="w-12 h-12" style={{ color: "#f59e0b" }} />,
        color: "#f59e0b",
        title: "APPLICATION UNDER REVIEW",
        message: "Your application is being reviewed by our recruiting staff. You will be contacted via Discord once a decision is made.",
      },
      APPROVED: {
        icon: <CheckCircle className="w-12 h-12" style={{ color: "#4ade80" }} />,
        color: "#4ade80",
        title: "APPLICATION APPROVED",
        message: "Congratulations! Your application has been approved. Check Discord for your selection and onboarding assignment.",
      },
      DENIED: {
        icon: <XCircle className="w-12 h-12" style={{ color: "#ef4444" }} />,
        color: "#ef4444",
        title: "APPLICATION DENIED",
        message: "Your application was not approved at this time. Contact a recruiter on Discord for more information.",
      },
    };

    const cfg = statusConfig[app.status] || statusConfig.PENDING;

    return (
      <div className="bg-[#090b07] min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="mb-6">{cfg.icon}</div>
          <h1 className="text-xl font-black tracking-widest uppercase mb-3" style={{ color: cfg.color, fontFamily: "monospace" }}>
            {cfg.title}
          </h1>
          <p className="text-sm mb-4" style={{ color: "#8a8870" }}>{cfg.message}</p>
          <p className="text-xs" style={{ color: "#6b6a58" }}>Submitted: {date}</p>
          <div className="mt-8">
            <Link href="/" className="text-xs font-bold tracking-widest uppercase" style={{ color: "#c9a128" }}>
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch open entry-level billets (no leadership roles)
  const { data: billetRows } = await supabase
    .from("soldiers")
    .select("id, role, mos, mos_title, team, unit")
    .eq("status", "VACANT")
    .eq("unit", "Interagency Special Missions Group")
    .not("role", "ilike", "%leader%")
    .not("role", "ilike", "%sergeant%")
    .not("role", "ilike", "%commander%")
    .not("role", "ilike", "%officer%")
    .order("team")
    .order("role");

  const openBillets: OpenBillet[] = (billetRows ?? []).map(b => ({
    id:       b.id,
    role:     b.role,
    mos:      b.mos,
    mosTitle: b.mos_title,
    team:     b.team ?? "Unassigned",
  }));

  // No application — show the enlist form
  return <EnlistClientPage openBillets={openBillets} />;
}
