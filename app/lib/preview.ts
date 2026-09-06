"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";

export type ViewRole = "guest" | "member" | "admin";

/**
 * Returns the effective role to render as.
 * Real admins can override this via the preview cookie.
 * Non-admins always get their real role.
 */
export async function getViewRole(): Promise<ViewRole> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return "guest";

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isRealAdmin = !!(profile && ["admin", "superadmin"].includes(profile.role));

  if (!isRealAdmin) {
    // Non-admin users always see their real role
    return "member";
  }

  // Real admin — check if they have a preview override set
  const cookieStore = await cookies();
  const preview = cookieStore.get("preview-role")?.value as ViewRole | undefined;
  return preview ?? "admin";
}

/**
 * Server action: set the preview role cookie.
 * Only takes effect for real admins (checked at read time via getViewRole).
 */
export async function setPreviewRole(role: ViewRole): Promise<void> {
  const cookieStore = await cookies();
  if (role === "admin") {
    // Reset — remove override cookie
    cookieStore.delete("preview-role");
  } else {
    cookieStore.set("preview-role", role, {
      path: "/",
      maxAge: 60 * 60, // 1 hour
      httpOnly: false,  // readable client-side for the bar UI
    });
  }
  revalidatePath("/", "layout");
}
