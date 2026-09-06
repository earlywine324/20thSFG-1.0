import { createAdminClient } from "@/app/lib/supabase/admin";
import { UserCog } from "lucide-react";
import RoleSelect from "./RoleSelect";
import type { ProfileRole } from "@/app/lib/actions/users";

export default async function UsersPage() {
  const adminClient = createAdminClient();

  // Get all auth users (includes email)
  const { data: { users: authUsers }, error: authErr } = await adminClient.auth.admin.listUsers({ perPage: 1000 });

  // Get all profiles (includes role)
  const { data: profiles } = await adminClient
    .from("profiles")
    .select("id, role");

  // Get all soldiers so we can match by discord_id for a real callsign
  const { data: soldiers } = await adminClient
    .from("soldiers")
    .select("callsign, discord_id, name")
    .not("discord_id", "is", null);

  if (authErr || !authUsers) {
    return (
      <div className="p-8">
        <p className="text-sm" style={{ color: "#f85149" }}>
          Failed to load users. Make sure SUPABASE_SERVICE_ROLE_KEY is set.
        </p>
      </div>
    );
  }

  // Merge auth users with profiles
  const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.role as ProfileRole]));

  // Map discord_id → soldier callsign/name for display
  const discordMap = Object.fromEntries(
    (soldiers ?? [])
      .filter(s => s.discord_id)
      .map(s => [s.discord_id!.toLowerCase(), { callsign: s.callsign, name: s.name }])
  );

  const rows = authUsers.map(u => {
    // Try to match soldier by discord username stored in metadata
    const discordHandle = (u.user_metadata?.discord_username as string | undefined)?.toLowerCase();
    const soldier = discordHandle ? discordMap[discordHandle] : undefined;
    const displayName: string =
      soldier?.callsign
      ?? soldier?.name
      ?? (u.user_metadata?.display_name as string | undefined)
      ?? "—";

    return {
      id:          u.id,
      email:       u.email ?? "—",
      displayName,
      role:        profileMap[u.id] ?? ("member" as ProfileRole),
      createdAt:   u.created_at,
      lastSignIn:  u.last_sign_in_at,
    };
  }).sort((a, b) => {
    // Sort: superadmin → admin → member, then by email
    const order: Record<ProfileRole, number> = { superadmin: 0, admin: 1, member: 2 };
    const diff = (order[a.role as ProfileRole] ?? 3) - (order[b.role as ProfileRole] ?? 3);
    return diff !== 0 ? diff : a.email.localeCompare(b.email);
  });

  const roleColor = (r: ProfileRole) =>
    r === "superadmin" ? "#f85149" : r === "admin" ? "#d29922" : "#8b949e";

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-black tracking-[0.35em] uppercase mb-2" style={{ color: "#d29922" }}>
          User Management
        </p>
        <h1 className="text-3xl font-black" style={{ color: "#e6edf3" }}>Accounts</h1>
        <p className="text-sm mt-1" style={{ color: "#8b949e" }}>
          {rows.length} registered {rows.length === 1 ? "account" : "accounts"}
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#0d1117", border: "1px solid #21262d" }}>
        {/* Header row */}
        <div className="flex items-center gap-4 px-5 py-3"
          style={{ background: "#161b22", borderBottom: "1px solid #21262d" }}>
          <div className="flex-1 text-[9px] font-black font-mono tracking-widest uppercase" style={{ color: "#484f58" }}>Account</div>
          <div className="w-24 text-[9px] font-black font-mono tracking-widest uppercase text-right" style={{ color: "#484f58" }}>Current Role</div>
          <div className="w-64 text-[9px] font-black font-mono tracking-widest uppercase" style={{ color: "#484f58" }}>Change Role</div>
          <div className="w-36 text-[9px] font-black font-mono tracking-widest uppercase text-right hidden lg:block" style={{ color: "#484f58" }}>Last Sign-in</div>
        </div>

        {rows.length === 0 && (
          <div className="px-5 py-12 text-center">
            <UserCog className="w-8 h-8 mx-auto mb-3" style={{ color: "#21262d" }} />
            <p className="text-sm" style={{ color: "#484f58" }}>No accounts found.</p>
          </div>
        )}

        {rows.map((row, i) => (
          <div
            key={row.id}
            className="flex items-center gap-4 px-5 py-4"
            style={{ borderBottom: i < rows.length - 1 ? "1px solid #21262d" : undefined }}
          >
            {/* Account */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: "#e6edf3" }}>
                {row.displayName !== "—" ? row.displayName : row.email}
              </div>
              <div className="text-[10px] font-mono truncate" style={{ color: "#484f58" }}>
                {row.email}
              </div>
            </div>

            {/* Current role badge */}
            <div className="w-24 flex justify-end shrink-0">
              <span
                className="text-[9px] font-black font-mono tracking-wider uppercase px-2 py-1 rounded-full"
                style={{ color: roleColor(row.role), background: `${roleColor(row.role)}18`, border: `1px solid ${roleColor(row.role)}30` }}
              >
                {row.role}
              </span>
            </div>

            {/* Role select */}
            <div className="w-64 shrink-0">
              <RoleSelect userId={row.id} currentRole={row.role} />
            </div>

            {/* Last sign-in */}
            <div className="w-36 shrink-0 text-right hidden lg:block">
              <span className="text-[10px] font-mono" style={{ color: "#484f58" }}>
                {row.lastSignIn
                  ? new Date(row.lastSignIn).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "Never"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
