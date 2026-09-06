import { createAdminClient } from "@/app/lib/supabase/admin";
import { MessageSquare } from "lucide-react";
import ComposeForm from "./ComposeForm";

export default async function AdminNotificationsPage() {
  const admin = createAdminClient();

  // Soldiers with a linked user account only
  const { data: soldiers } = await admin
    .from("soldiers")
    .select("id, name, rank, role, team, unit, user_id")
    .eq("status", "ACTIVE DUTY")
    .not("user_id", "is", null)
    .order("name");

  const recipients = (soldiers ?? []).map((s) => ({
    id:    s.id   as string,
    name:  s.name as string,
    rank:  s.rank as string,
    role:  s.role as string,
    label: `${s.rank} ${s.name} — ${(s.team as string) || (s.unit as string)}`,
  }));

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="w-5 h-5" style={{ color: "#4db6e0" }} />
          <p className="text-[10px] font-black tracking-[0.35em] uppercase" style={{ color: "#4db6e0" }}>
            Personnel Messaging
          </p>
        </div>
        <h1 className="text-3xl font-black" style={{ color: "#e8e4d8" }}>Send Direct Message</h1>
        <p className="text-xs mt-1" style={{ color: "#6b6a58" }}>
          Messages appear in the soldier&apos;s notification inbox on the site.
          Only soldiers with a linked user account can receive messages.
        </p>
      </div>

      {recipients.length === 0 ? (
        <div
          className="rounded-lg p-8 text-center"
          style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}
        >
          <MessageSquare className="w-8 h-8 mx-auto mb-3" style={{ color: "#4a4838" }} />
          <p className="text-sm font-bold mb-1" style={{ color: "#8a8870" }}>No linked accounts</p>
          <p className="text-xs" style={{ color: "#4a4838" }}>
            Go to Admin → Soldiers and set a User ID on each soldier&apos;s edit page to enable messaging.
          </p>
        </div>
      ) : (
        <ComposeForm recipients={recipients} />
      )}
    </div>
  );
}
