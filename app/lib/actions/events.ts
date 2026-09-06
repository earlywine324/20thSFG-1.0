"use server";

import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || !["admin", "superadmin"].includes(profile.role)) {
    redirect("/operations");
  }
  return { supabase, userId: user.id };
}

export type EventFormState = { error?: string } | null;

export async function createEvent(
  _prev: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const { supabase, userId } = await requireAdmin();

  const title       = (formData.get("title") as string)?.trim();
  const type        = (formData.get("type") as string)?.trim();
  const event_date  = formData.get("event_date") as string;
  const time        = (formData.get("time") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const lead        = (formData.get("lead") as string)?.trim();
  const element     = (formData.get("element") as string)?.trim();
  const theatre     = (formData.get("theatre") as string)?.trim();

  if (!title)      return { error: "Title is required." };
  if (!type)       return { error: "Event type is required." };
  if (!event_date) return { error: "Date is required." };

  const { error } = await supabase.from("events").insert({
    title,
    type,
    event_date,
    time:        time || null,
    description: description || null,
    lead:        lead || null,
    element:     element || null,
    theatre:     theatre || null,
    status:      "UPCOMING",
    created_by:  userId,
  });

  if (error) return { error: error.message };

  revalidatePath("/operations");
  redirect("/operations");
}

export async function deleteEvent(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/operations");
  return { success: true };
}
