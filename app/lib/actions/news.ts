"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";

export type PostFormState = { error?: string } | null;

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
    redirect("/news");
  }
  return supabase;
}

export async function createPost(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const supabase = await requireAdmin();

  const title    = (formData.get("title")    as string | null)?.trim();
  const category = (formData.get("category") as string | null)?.trim();
  const excerpt  = (formData.get("excerpt")  as string | null)?.trim();
  const content  = (formData.get("content")  as string | null)?.trim();
  const author   = ((formData.get("author")  as string | null)?.trim()) || "S6 PAO";
  const pinned   = formData.get("pinned") === "true";
  const imageFile = formData.get("image") as File | null;

  if (!title || !category || !excerpt || !content) {
    return { error: "Title, category, excerpt, and content are required." };
  }

  // Upload cover image if provided
  let image_url: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const ext  = imageFile.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bytes = await imageFile.arrayBuffer();

    const { error: uploadErr } = await supabase.storage
      .from("news-images")
      .upload(path, bytes, { contentType: imageFile.type, upsert: false });

    if (uploadErr) {
      console.error("Image upload error:", uploadErr);
      return { error: "Image upload failed. Try again or submit without an image." };
    }

    const { data: urlData } = supabase.storage.from("news-images").getPublicUrl(path);
    image_url = urlData.publicUrl;
  }

  const { error } = await supabase.from("news_posts").insert({
    title,
    category,
    excerpt,
    content,
    author,
    pinned,
    published: true,
    image_url,
  });

  if (error) {
    console.error("news_posts insert error:", error);
    return { error: "Failed to create post. Please try again." };
  }

  revalidatePath("/news");
  redirect("/news");
}

export async function deletePost(id: string) {
  const supabase = await requireAdmin();
  await supabase.from("news_posts").delete().eq("id", id);
  revalidatePath("/news");
}

export async function togglePin(id: string, pinned: boolean) {
  const supabase = await requireAdmin();
  await supabase.from("news_posts").update({ pinned: !pinned }).eq("id", id);
  revalidatePath("/news");
}
