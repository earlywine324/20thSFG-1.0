"use server";

import { createClient } from "@/app/lib/supabase/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function uploadSoldierImage(
  soldierId: string,
  imageType: "photo" | "signature",
  formData: FormData,
) {
  try {
    // ── Fail fast if service role key is missing ──
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { error: "SUPABASE_SERVICE_ROLE_KEY is not set in environment variables." };
    }

    // ── Auth check ──
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (!profile || !["admin", "superadmin"].includes(profile.role)) {
      return { error: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    if (!file || file.size === 0) return { error: "No file provided" };
    if (!file.type.startsWith("image/")) return { error: "File must be an image" };
    if (file.size > 10 * 1024 * 1024) return { error: "File must be under 10 MB" };

    // ── Service-role client bypasses storage RLS ──
    const admin = createAdminClient();

    const ext  = (file.name.split(".").pop() || "png").toLowerCase();
    const path = `${soldierId}/${imageType}.${ext}`;

    // Convert to buffer and upload — upsert handles replacement
    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await admin.storage
      .from("soldiers")
      .upload(path, bytes, { contentType: file.type, upsert: true });

    if (uploadError) {
      console.error("[upload] storage error:", uploadError);
      return { error: `Storage error: ${uploadError.message}` };
    }

    // Build public URL with cache-buster
    const { data: urlData } = admin.storage.from("soldiers").getPublicUrl(path);
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    // Persist URL to soldier record
    const column = imageType === "photo" ? "photo_url" : "signature_url";
    const { error: updateError } = await admin
      .from("soldiers")
      .update({ [column]: publicUrl })
      .eq("id", soldierId);

    if (updateError) {
      console.error("[upload] db update error:", updateError);
      return { error: `DB error: ${updateError.message}` };
    }

    revalidatePath(`/roster/${soldierId}`);
    return { success: true, url: publicUrl };

  } catch (err) {
    console.error("[upload] unexpected error:", err);
    return { error: "Unexpected error during upload. Check server logs." };
  }
}
