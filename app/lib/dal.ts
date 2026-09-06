import { cache } from "react";
import { createClient } from "@/app/lib/supabase/server";
import { redirect } from "next/navigation";

/** Returns the current user + profile, or null — deduplicated per request via React cache */
export const getSession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { user, profile };
});

/** Returns true if the current user is an admin/superadmin — deduplicated per request */
export const checkAdmin = cache(async (): Promise<boolean> => {
  const session = await getSession();
  return !!(session?.profile && ["admin", "superadmin"].includes(session.profile.role));
});

/** Redirect to login if not authenticated */
export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/** Redirect to login if not authenticated, or forbidden if not admin */
export async function requireAdmin() {
  const session = await requireAuth();
  if (!session.profile || !["admin", "superadmin"].includes(session.profile.role)) {
    redirect("/forbidden");
  }
  return session;
}
