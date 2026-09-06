"use server";

import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { assignSoldierToBillet } from "@/app/lib/actions/soldiers";

export async function approveApplication(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the application data
  const { data: app, error: fetchError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !app) return { error: fetchError?.message || "Application not found" };

  // Mark application as approved
  const { error } = await supabase
    .from("applications")
    .update({
      status: "APPROVED",
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  // Auto-create soldier profile in Training Detachment
  const soldierId = `rct-${app.callsign.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString(36)}`;
  const now = new Date();
  const enlistDate = `${now.getDate().toString().padStart(2, "0")} ${["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][now.getMonth()]} ${now.getFullYear()}`;

  const { error: soldierError } = await supabase.from("soldiers").insert({
    id: soldierId,
    rank: "PVT",
    rank_full: "Private",
    name: app.callsign,
    callsign: app.callsign,
    mos: app.mos_preference === "any" ? "11X" : app.mos_preference,
    mos_title: app.mos_preference === "any" ? "Ranger Candidate" : getMosTitle(app.mos_preference),
    role: "Ranger Trainee",
    unit: "RASP Pipeline",
    team: "RASP",
    status: "ACTIVE DUTY",
    enlist_date: enlistDate,
    time_in_service: "0 days",
    time_in_grade: "0 days",
    quals: [],
    avatar: "RCT",
    discord_id: app.discord_username,
    timezone: app.timezone,
    last_active: enlistDate,
    awards: [],
    service_record: [{ date: enlistDate, event: "Enlisted", details: `Accepted into 1st Plt, A Co, 1/75th RGR. Assigned to Ranger Assessment and Selection Program (RASP).` }],
    rank_history: [{ rank: "PVT", rankFull: "Private", date: enlistDate, authority: "Enlistment" }],
    assignment_history: [{ position: "Ranger Trainee", unit: "RASP Pipeline", dateFrom: enlistDate }],
  });

  if (soldierError) {
    console.error("Failed to create soldier profile:", soldierError.message);
    // Application is still approved even if soldier creation fails
  }

  // If the applicant selected a specific open billet, assign them directly
  if (!soldierError && app.billet_id) {
    const assignResult = await assignSoldierToBillet(soldierId, app.billet_id);
    if (assignResult.error) {
      console.error("Auto-assign to billet failed:", assignResult.error);
      // Non-fatal — soldier is in RASP as fallback
    }
  }

  revalidatePath("/admin/applications");
  revalidatePath("/admin/soldiers");
  revalidatePath("/admin");
  revalidatePath("/roster");
  return { success: true, soldierId };
}

function getMosTitle(mos: string): string {
  const titles: Record<string, string> = {
    "11A": "Infantry Officer Candidate",
    "11B": "Ranger Trainee",
    "11C": "Indirect Fire Infantryman Trainee",
    "68W": "Combat Medic Trainee",
    "25U": "Signal Support Trainee",
    "13F": "Fire Support Specialist Trainee",
  };
  return titles[mos] || "Ranger Candidate";
}

export async function denyApplication(id: string, notes?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("applications")
    .update({
      status: "DENIED",
      admin_notes: notes || null,
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/applications");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteApplication(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/applications");
  revalidatePath("/admin");
  return { success: true };
}
