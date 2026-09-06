"use server";

import { createAdminClient } from "@/app/lib/supabase/admin";
import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type NotificationType = "message" | "promotion" | "award" | "qualification" | "assignment";

// ─── Internal helper — always uses admin client so it works from any context ──

export async function createNotification({
  recipientUserId,
  senderUserId,
  type,
  title,
  body,
}: {
  recipientUserId: string;
  senderUserId?: string | null;
  type: NotificationType;
  title: string;
  body: string;
}) {
  if (!recipientUserId) return;
  try {
    const admin = createAdminClient();
    await admin.from("notifications").insert({
      recipient_user_id: recipientUserId,
      sender_user_id: senderUserId ?? null,
      type,
      title,
      body,
    });
  } catch { /* non-critical */ }
}

// ─── Admin: send a DM to a soldier (by soldier id) ───────────────────────────

export async function sendDirectMessage(soldierId: string, title: string, body: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "superadmin"].includes(profile.role)) {
    return { error: "Unauthorized" };
  }

  // Look up the soldier's linked user_id
  const admin = createAdminClient();
  const { data: soldier } = await admin
    .from("soldiers")
    .select("user_id, name")
    .eq("id", soldierId)
    .single();

  if (!soldier?.user_id) return { error: "Soldier has no linked account. Link their User ID in the soldier edit page first." };

  await createNotification({
    recipientUserId: soldier.user_id,
    senderUserId: user.id,
    type: "message",
    title,
    body,
  });

  return { success: true };
}

// ─── User: get their notifications ───────────────────────────────────────────

export async function getMyNotifications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return data ?? [];
}

// ─── User: get unread count ───────────────────────────────────────────────────

export async function getUnreadCount(): Promise<number> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("recipient_user_id", user.id)
    .eq("read", false);

  return count ?? 0;
}

// ─── User: mark a notification as read ───────────────────────────────────────

export async function markRead(notificationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("recipient_user_id", user.id);

  revalidatePath("/notifications");
}

// ─── User: mark all as read ───────────────────────────────────────────────────

export async function markAllRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("recipient_user_id", user.id)
    .eq("read", false);

  revalidatePath("/notifications");
}
