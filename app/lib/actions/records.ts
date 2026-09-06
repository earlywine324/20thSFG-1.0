"use server";

import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/app/lib/actions/notifications";

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || !["admin", "superadmin"].includes(profile.role)) return null;
  return supabase;
}

async function appendRecord(soldierId: string, column: string, entry: Record<string, string | undefined>) {
  const supabase = await verifyAdmin();
  if (!supabase) return { error: "Unauthorized" };

  const { data: soldier } = await supabase
    .from("soldiers")
    .select(column)
    .eq("id", soldierId)
    .single();

  if (!soldier) return { error: "Soldier not found" };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (soldier as any)[column];
  const existing = Array.isArray(raw) ? raw : [];

  const { error } = await supabase
    .from("soldiers")
    .update({ [column]: [entry, ...existing] })
    .eq("id", soldierId);

  if (error) return { error: error.message };
  revalidatePath(`/roster/${soldierId}`);
  return { success: true };
}

async function removeRecord(soldierId: string, column: string, index: number) {
  const supabase = await verifyAdmin();
  if (!supabase) return { error: "Unauthorized" };

  const { data: soldier } = await supabase
    .from("soldiers")
    .select(column)
    .eq("id", soldierId)
    .single();

  if (!soldier) return { error: "Soldier not found" };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (soldier as any)[column];
  const existing = Array.isArray(raw) ? [...raw] : [];
  if (index < 0 || index >= existing.length) return { error: "Invalid index" };
  existing.splice(index, 1);

  const { error } = await supabase
    .from("soldiers")
    .update({ [column]: existing })
    .eq("id", soldierId);

  if (error) return { error: error.message };
  revalidatePath(`/roster/${soldierId}`);
  return { success: true };
}

// ── Service Record ──
export async function addServiceRecord(soldierId: string, formData: FormData) {
  return appendRecord(soldierId, "service_record", {
    date: formData.get("date") as string,
    event: formData.get("event") as string,
    details: (formData.get("details") as string) || undefined,
  });
}

export async function removeServiceRecord(soldierId: string, index: number) {
  return removeRecord(soldierId, "service_record", index);
}

// ── Award Record ──
export async function addAwardRecord(soldierId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const dateAwarded = formData.get("dateAwarded") as string;
  const citation = (formData.get("citation") as string) || undefined;

  const result = await appendRecord(soldierId, "awards", { name, dateAwarded, citation });
  if (result.error) return result;

  // Auto-notify
  const supabase = await verifyAdmin();
  if (supabase) {
    const { data: soldier } = await supabase
      .from("soldiers").select("user_id, name").eq("id", soldierId).single();
    if (soldier?.user_id) {
      await createNotification({
        recipientUserId: soldier.user_id,
        type: "award",
        title: `Award: ${name}`,
        body: `${soldier.name}, you have been awarded the ${name} effective ${dateAwarded}.${citation ? ` Citation: ${citation}` : ""} Rangers Lead the Way.`,
      });
    }
  }
  return result;
}

export async function removeAwardRecord(soldierId: string, index: number) {
  return removeRecord(soldierId, "awards", index);
}

// ── Combat Record ──
export async function addCombatRecord(soldierId: string, formData: FormData) {
  return appendRecord(soldierId, "combat_record", {
    date: formData.get("date") as string,
    operation: formData.get("operation") as string,
    details: (formData.get("details") as string) || undefined,
  });
}

export async function removeCombatRecord(soldierId: string, index: number) {
  return removeRecord(soldierId, "combat_record", index);
}

// ── Rank Record ──
export async function addRankRecord(soldierId: string, formData: FormData) {
  const rank = formData.get("rank") as string;
  const rankFull = formData.get("rankFull") as string;
  const date = formData.get("date") as string;
  const authority = (formData.get("authority") as string) || undefined;

  const result = await appendRecord(soldierId, "rank_history", { rank, rankFull, date, authority });
  if (result.error) return result;

  // Also update the soldier's current rank
  const supabase = await verifyAdmin();
  if (supabase) {
    await supabase
      .from("soldiers")
      .update({ rank, rank_full: rankFull, last_promotion: date })
      .eq("id", soldierId);
    revalidatePath(`/roster/${soldierId}`);
    revalidatePath("/roster");
  }

  return { success: true };
}

export async function removeRankRecord(soldierId: string, index: number) {
  return removeRecord(soldierId, "rank_history", index);
}

// ── Assignment Record ──
export async function addAssignmentRecord(soldierId: string, formData: FormData) {
  const position = formData.get("position") as string;
  const unit = formData.get("unit") as string;
  const dateFrom = formData.get("dateFrom") as string;
  const dateTo = (formData.get("dateTo") as string) || undefined;

  const result = await appendRecord(soldierId, "assignment_history", { position, unit, dateFrom, dateTo });
  if (result.error) return result;

  // Update current position/unit if no end date
  if (!dateTo) {
    const supabase = await verifyAdmin();
    if (supabase) {
      await supabase
        .from("soldiers")
        .update({ role: position, unit })
        .eq("id", soldierId);
      revalidatePath(`/roster/${soldierId}`);
      revalidatePath("/roster");
    }
  }

  return { success: true };
}

export async function removeAssignmentRecord(soldierId: string, index: number) {
  return removeRecord(soldierId, "assignment_history", index);
}

// ── Qualification Record ──
export async function addQualificationRecord(soldierId: string, formData: FormData) {
  const date = formData.get("date") as string;
  const qualification = formData.get("qualification") as string;

  const result = await appendRecord(soldierId, "qualification_record", { date, qualification });
  if (result.error) return result;

  // Also add to quals array if not already there + notify
  const supabase = await verifyAdmin();
  if (supabase) {
    const { data: soldier } = await supabase
      .from("soldiers")
      .select("quals, user_id, name")
      .eq("id", soldierId)
      .single();

    if (soldier) {
      const quals: string[] = Array.isArray(soldier.quals) ? soldier.quals : [];
      if (!quals.includes(qualification)) {
        await supabase
          .from("soldiers")
          .update({ quals: [...quals, qualification] })
          .eq("id", soldierId);
      }

      // Notify
      if (soldier.user_id) {
        await createNotification({
          recipientUserId: soldier.user_id,
          type: "qualification",
          title: `Qualification Awarded: ${qualification}`,
          body: `${soldier.name}, you have been awarded the ${qualification} qualification effective ${date}. Rangers Lead the Way.`,
        });
      }
    }
    revalidatePath(`/roster/${soldierId}`);
  }

  return { success: true };
}

export async function removeQualificationRecord(soldierId: string, index: number) {
  return removeRecord(soldierId, "qualification_record", index);
}
