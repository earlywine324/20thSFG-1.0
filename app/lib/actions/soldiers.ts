"use server";

import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ALL_RANKS, toMilDate } from "@/app/lib/promotions";
import { createNotification } from "@/app/lib/actions/notifications";

export async function upsertSoldier(formData: FormData) {
  const supabase = await createClient();
  const isNew = formData.get("_isNew") === "true";

  const soldier = {
    id: formData.get("id") as string,
    rank: formData.get("rank") as string,
    rank_full: formData.get("rankFull") as string,
    name: formData.get("name") as string,
    callsign: (formData.get("callsign") as string) || null,
    positional_callsign: (formData.get("positionalCallsign") as string) || null,
    mos: formData.get("mos") as string,
    mos_title: formData.get("mosTitle") as string,
    role: formData.get("role") as string,
    unit: formData.get("unit") as string,
    team: (formData.get("team") as string) || null,
    status: formData.get("status") as string,
    enlist_date: (formData.get("enlistDate") as string) || null,
    last_promotion: (formData.get("lastPromotion") as string) || null,
    time_in_service: (formData.get("timeInService") as string) || null,
    time_in_grade: (formData.get("timeInGrade") as string) || null,
    quals: formData.getAll("quals") as string[],
    staff_teams: formData.getAll("staffTeams") as string[],
    avatar: (formData.get("avatar") as string) || "RCT",
    discord_id: (formData.get("discordId") as string) || null,
    timezone: (formData.get("timezone") as string) || null,
    user_id: (formData.get("userId") as string) || null,
  };

  // For new soldiers: if last_promotion wasn't set, default it to enlist_date
  // so the TIG clock starts the moment they enlist (required for auto-promotions).
  if (isNew && !soldier.last_promotion && soldier.enlist_date) {
    soldier.last_promotion = soldier.enlist_date;
  }

  let error;
  if (isNew) {
    ({ error } = await supabase.from("soldiers").insert(soldier));
  } else {
    ({ error } = await supabase.from("soldiers").update(soldier).eq("id", soldier.id));
  }

  if (error) return { error: error.message };
  revalidatePath("/admin/soldiers");
  revalidatePath("/roster");
  return { success: true, id: soldier.id };
}

export async function assignSoldierToBillet(soldierId: string, billetId: string) {
  const supabase = await createClient();

  // Fetch the billet (vacant slot) to get its role/unit/team info
  const { data: billet, error: billetErr } = await supabase
    .from("soldiers")
    .select("*")
    .eq("id", billetId)
    .single();

  if (billetErr || !billet) return { error: billetErr?.message || "Billet not found" };
  if (billet.status !== "VACANT") return { error: "Billet is not vacant" };

  // Fetch the soldier being assigned
  const { data: soldier, error: soldierErr } = await supabase
    .from("soldiers")
    .select("*")
    .eq("id", soldierId)
    .single();

  if (soldierErr || !soldier) return { error: soldierErr?.message || "Soldier not found" };

  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2, "0")} ${["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][now.getMonth()]} ${now.getFullYear()}`;

  const isAdminBillet = billet.unit === "Administrative";

  if (isAdminBillet) {
    // ── Administrative billet ──
    // Don't touch the soldier's primary unit/role/team.
    // Just append this staff team to their staff_teams array.
    const existingStaffTeams: string[] = Array.isArray(soldier.staff_teams) ? soldier.staff_teams : [];
    const newStaffTeams = existingStaffTeams.includes(billet.team)
      ? existingStaffTeams
      : [...existingStaffTeams, billet.team];

    const serviceEntry = { date: dateStr, event: "Staff Assignment", details: `Assigned to ${billet.role}, ${billet.team}.` };
    const existingService = Array.isArray(soldier.service_record) ? soldier.service_record : [];

    const { error: updateErr } = await supabase
      .from("soldiers")
      .update({
        staff_teams: newStaffTeams,
        service_record: [serviceEntry, ...existingService],
      })
      .eq("id", soldierId);

    if (updateErr) return { error: updateErr.message };

    // Remove the vacant admin billet placeholder
    await supabase.from("soldiers").delete().eq("id", billetId);

  } else {
    // ── Primary unit billet ──
    // Recreate old billet as vacant — but never for selection or training pipelines
    const noVacantUnits = ["USAJFKSWCS", "Selection Pipeline"];
    if (soldier.status === "ACTIVE DUTY" && !noVacantUnits.includes(soldier.unit)) {
      const oldBilletId = `vacant-${soldier.role.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString(36)}`;
      await supabase.from("soldiers").insert({
        id: oldBilletId,
        rank: soldier.rank,
        rank_full: soldier.rank_full,
        name: "[VACANT]",
        mos: soldier.mos,
        mos_title: soldier.mos_title,
        role: soldier.role,
        unit: soldier.unit,
        team: soldier.team,
        status: "VACANT",
        avatar: soldier.avatar || soldier.rank,
        quals: [],
        awards: [],
        service_record: [],
        rank_history: [],
        assignment_history: [],
      });
    }

    const assignmentEntry = { position: billet.role, unit: billet.unit, dateFrom: dateStr };
    const serviceEntry = { date: dateStr, event: "Assigned", details: `Assigned to ${billet.role}, ${billet.team || billet.unit}.` };
    const existingAssignments = Array.isArray(soldier.assignment_history) ? soldier.assignment_history : [];
    const existingService = Array.isArray(soldier.service_record) ? soldier.service_record : [];

    const { error: updateErr } = await supabase
      .from("soldiers")
      .update({
        role:       billet.role,
        unit:       billet.unit,
        team:       billet.team,
        mos:        billet.mos        || soldier.mos,
        mos_title:  billet.mos_title  || soldier.mos_title,
        status: "ACTIVE DUTY",
        assignment_history: [assignmentEntry, ...existingAssignments],
        service_record: [serviceEntry, ...existingService],
      })
      .eq("id", soldierId);

    if (updateErr) return { error: updateErr.message };

    // Delete the vacant billet row
    const { error: delErr } = await supabase.from("soldiers").delete().eq("id", billetId);
    if (delErr) return { error: delErr.message };
  }

  revalidatePath("/roster");
  revalidatePath("/admin/soldiers");
  return { success: true };
}

export async function promoteSoldier(id: string, newRank: string, authority: string = "Admin") {
  const supabase = await createClient();

  const { data: soldier, error: fetchErr } = await supabase
    .from("soldiers")
    .select("rank, rank_full, rank_history, service_record")
    .eq("id", id)
    .single();

  if (fetchErr || !soldier) return { error: fetchErr?.message || "Soldier not found" };

  const newRankFull = ALL_RANKS[newRank] || newRank;
  const dateStr = toMilDate(new Date());

  const rankHistoryEntry = {
    rank: newRank,
    rankFull: newRankFull,
    date: dateStr,
    authority,
  };
  const serviceEntry = {
    date: dateStr,
    event: "Promoted",
    details: `Promoted from ${soldier.rank_full} (${soldier.rank}) to ${newRankFull} (${newRank}) by ${authority}.`,
  };

  const existingRankHistory = Array.isArray(soldier.rank_history) ? soldier.rank_history : [];
  const existingService = Array.isArray(soldier.service_record) ? soldier.service_record : [];

  const { error } = await supabase
    .from("soldiers")
    .update({
      rank: newRank,
      rank_full: newRankFull,
      last_promotion: dateStr,
      time_in_grade: "0 days",
      rank_history: [rankHistoryEntry, ...existingRankHistory],
      service_record: [serviceEntry, ...existingService],
    })
    .eq("id", id);

  if (error) return { error: error.message };

  // Auto-notify the soldier if they have a linked account
  const { data: updated } = await supabase
    .from("soldiers").select("user_id, name").eq("id", id).single();
  if (updated?.user_id) {
    await createNotification({
      recipientUserId: updated.user_id,
      type: "promotion",
      title: `Promoted to ${newRankFull}`,
      body: `Congratulations, ${updated.name}. You have been promoted to ${newRankFull} (${newRank}) effective ${dateStr}. De Oppresso Liber.`,
    });
  }

  revalidatePath("/admin/soldiers");
  revalidatePath("/roster");
  return { success: true };
}

export async function swapSoldiers(idA: string, idB: string) {
  const supabase = await createClient();

  const { data: rows, error: fetchErr } = await supabase
    .from("soldiers")
    .select("id, role, unit, team, mos, mos_title, positional_callsign, assignment_history, service_record, rank, rank_full, name")
    .in("id", [idA, idB]);

  if (fetchErr || !rows || rows.length !== 2) return { error: "Could not fetch both soldiers" };

  const a = rows.find((r) => r.id === idA)!;
  const b = rows.find((r) => r.id === idB)!;

  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2, "0")} ${["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][now.getMonth()]} ${now.getFullYear()}`;

  const makeAssignmentEntry = (role: string, unit: string) => ({ position: role, unit, dateFrom: dateStr });
  const makeServiceEntry    = (from: string, to: string)   => ({ date: dateStr, event: "Reassigned", details: `Swapped from ${from} to ${to}.` });

  const [{ error: errA }, { error: errB }] = await Promise.all([
    supabase.from("soldiers").update({
      role:               b.role,
      unit:               b.unit,
      team:               b.team,
      mos:                b.mos,
      mos_title:          b.mos_title,
      positional_callsign: b.positional_callsign,
      assignment_history: [makeAssignmentEntry(b.role, b.unit), ...(Array.isArray(a.assignment_history) ? a.assignment_history : [])],
      service_record:     [makeServiceEntry(`${a.role}, ${a.unit}`, `${b.role}, ${b.unit}`), ...(Array.isArray(a.service_record) ? a.service_record : [])],
    }).eq("id", idA),

    supabase.from("soldiers").update({
      role:               a.role,
      unit:               a.unit,
      team:               a.team,
      mos:                a.mos,
      mos_title:          a.mos_title,
      positional_callsign: a.positional_callsign,
      assignment_history: [makeAssignmentEntry(a.role, a.unit), ...(Array.isArray(b.assignment_history) ? b.assignment_history : [])],
      service_record:     [makeServiceEntry(`${b.role}, ${b.unit}`, `${a.role}, ${a.unit}`), ...(Array.isArray(b.service_record) ? b.service_record : [])],
    }).eq("id", idB),
  ]);

  if (errA) return { error: errA.message };
  if (errB) return { error: errB.message };

  revalidatePath("/admin/soldiers");
  revalidatePath("/roster");
  return { success: true };
}

export async function dischargeSoldier(id: string, reason: string = "Honorable Discharge") {
  const supabase = await createClient();

  const { data: soldier, error: fetchErr } = await supabase
    .from("soldiers")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !soldier) return { error: fetchErr?.message || "Soldier not found" };
  if (soldier.status === "DISCHARGED") return { error: "Soldier is already discharged" };

  const dateStr = toMilDate(new Date());

  const serviceEntry = {
    date: dateStr,
    event: "Discharged",
    details: `${reason}. Released from ${soldier.role}, ${soldier.unit}.`,
  };
  const existingService = Array.isArray(soldier.service_record) ? soldier.service_record : [];

  const { error } = await supabase
    .from("soldiers")
    .update({
      status: "DISCHARGED",
      unit: null,
      team: null,
      role: null,
      staff_teams: [],
      service_record: [serviceEntry, ...existingService],
    })
    .eq("id", id);

  if (error) return { error: error.message };

  // Create a vacant billet for their old position (skip training pipelines)
  const noVacantUnits = ["USAJFKSWCS", "Selection Pipeline", "Administrative"];
  if (soldier.status === "ACTIVE DUTY" && !noVacantUnits.includes(soldier.unit)) {
    const vacantId = `vacant-${soldier.role.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString(36)}`;
    await supabase.from("soldiers").insert({
      id: vacantId,
      rank: soldier.rank,
      rank_full: soldier.rank_full,
      name: "[VACANT]",
      mos: soldier.mos,
      mos_title: soldier.mos_title,
      role: soldier.role,
      unit: soldier.unit,
      team: soldier.team,
      status: "VACANT",
      avatar: soldier.avatar || soldier.rank,
      quals: [],
      awards: [],
      service_record: [],
      rank_history: [],
      assignment_history: [],
    });
  }

  // Notify the soldier if linked
  if (soldier.user_id) {
    await createNotification({
      recipientUserId: soldier.user_id,
      type: "message",
      title: "You have been discharged",
      body: `${soldier.name}, you have been released from the unit effective ${dateStr}. Reason: ${reason}. Thank you for your service. De Oppresso Liber.`,
    });
  }

  revalidatePath("/admin/soldiers");
  revalidatePath("/roster");
  return { success: true };
}

export async function deleteSoldier(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("soldiers").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/soldiers");
  revalidatePath("/roster");
  return { success: true };
}
