import { NextResponse } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { createClient } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const result: Record<string, unknown> = {};

  // 1. Check auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  result.logged_in_as = user?.email ?? "not logged in";
  result.user_id = user?.id ?? null;

  if (!user) return NextResponse.json(result);

  const admin = createAdminClient();

  // 2. Check notifications table exists
  try {
    const { error } = await admin.from("notifications").select("id").limit(1);
    result.notifications_table = error ? `ERROR: ${error.message}` : "EXISTS";
  } catch (e) {
    result.notifications_table = `EXCEPTION: ${e}`;
  }

  // 3. Check if this user is linked to a soldier
  const { data: soldier } = await admin
    .from("soldiers")
    .select("id, name, rank, user_id")
    .eq("user_id", user.id)
    .single();

  result.linked_soldier = soldier
    ? { id: soldier.id, name: soldier.name, rank: soldier.rank }
    : "NOT LINKED — no soldier has user_id matching your account";

  // 4. Check user metadata (used for auto-linking)
  result.user_metadata = {
    display_name:     user.user_metadata?.display_name ?? null,
    discord_username: user.user_metadata?.discord_username ?? null,
    email:            user.email ?? null,
  };

  // 5. If not linked, show what soldiers could match
  if (!soldier) {
    const { data: unlinked } = await admin
      .from("soldiers")
      .select("id, name, discord_id")
      .eq("status", "ACTIVE DUTY")
      .is("user_id", null);

    result.unlinked_active_soldiers = unlinked?.map((s) => ({
      id: s.id, name: s.name, discord_id: s.discord_id,
    }));
  }

  // 6. If linked, show their notifications
  if (soldier) {
    const { data: notifs } = await admin
      .from("notifications")
      .select("id, type, title, read, created_at")
      .eq("recipient_user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);
    result.recent_notifications = notifs ?? [];
  }

  return NextResponse.json(result, { status: 200 });
}
