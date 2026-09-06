"use server";

import { createClient } from "@/app/lib/supabase/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { redirect } from "next/navigation";
import { toMilDate } from "@/app/lib/promotions";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirect") as string | null;

  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  // Post-login: auto-link + stamp last_active (fire-and-forget)
  if (authData.user?.id) {
    try {
      const admin = createAdminClient();
      const userId = authData.user.id;
      const today  = toMilDate(new Date());

      // Check if already linked
      const { data: alreadyLinked } = await admin
        .from("soldiers")
        .select("id")
        .eq("user_id", userId)
        .limit(1)
        .single();

      if (alreadyLinked) {
        // Already linked — just stamp last_active
        await admin
          .from("soldiers")
          .update({ last_active: today })
          .eq("user_id", userId);
      } else {
        // Try to auto-link by matching soldier records
        const displayName    = (authData.user.user_metadata?.display_name as string | undefined)?.trim();
        const discordHandle  = (authData.user.user_metadata?.discord_username as string | undefined)?.trim();
        const emailLocalPart = authData.user.email?.split("@")[0]?.trim();

        // Fetch all unlinked active-duty soldiers
        const { data: candidates } = await admin
          .from("soldiers")
          .select("id, name, discord_id")
          .eq("status", "ACTIVE DUTY")
          .is("user_id", null);

        let matchId: string | null = null;

        if (candidates && candidates.length > 0) {
          // 1. Discord handle match (highest confidence)
          if (discordHandle) {
            const m = candidates.find(
              (s) => s.discord_id && s.discord_id.toLowerCase().replace(/#\d+$/, "") === discordHandle.toLowerCase()
            );
            if (m) matchId = m.id;
          }

          // 2. Display name match against soldier name
          if (!matchId && displayName) {
            const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9.]/g, "");
            const matches = candidates.filter((s) => norm(s.name) === norm(displayName));
            if (matches.length === 1) matchId = matches[0].id; // only auto-link if unambiguous
          }

          // 3. Email local-part match (e.g. "jsmith" matches soldier "J.Smith")
          if (!matchId && emailLocalPart) {
            const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
            const matches = candidates.filter((s) => norm(s.name) === norm(emailLocalPart));
            if (matches.length === 1) matchId = matches[0].id;
          }
        }

        if (matchId) {
          await admin
            .from("soldiers")
            .update({ user_id: userId, last_active: today })
            .eq("id", matchId);
        }
      }
    } catch { /* non-critical — don't block login */ }
  }

  redirect(redirectTo || "/admin");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("displayName") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });

  if (error) {
    // Supabase rate limit — give the user a clear, actionable message
    if (error.message.toLowerCase().includes("rate limit") || error.message.toLowerCase().includes("email rate")) {
      return { error: "Registration is temporarily unavailable due to email limits. Please try again in a few minutes or contact an admin on Discord." };
    }
    return { error: error.message };
  }

  return { success: "Account created. You can now log in." };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
