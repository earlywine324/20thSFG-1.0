import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { ChevronLeft, FileText } from "lucide-react";
import PostForm from "./PostForm";

export default async function NewPostPage() {
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

  return (
    <div className="bg-[#07090e] text-[#e8edf5] min-h-screen">

      {/* Header */}
      <section
        className="relative py-16 px-6 overflow-hidden"
        style={{ borderBottom: "1px solid #161b27" }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#4db6e0 1px, transparent 1px), linear-gradient(90deg, #4db6e0 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <Link
            href="/news"
            className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-[#505870] hover:text-[#4db6e0] transition-colors mb-6"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to News
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: "rgba(77,182,224,0.1)",
                border: "1px solid rgba(77,182,224,0.2)",
              }}
            >
              <FileText className="w-4 h-4 text-[#4db6e0]" />
            </div>
            <p className="text-[10px] font-black tracking-[0.35em] uppercase text-[#4db6e0]">
              Admin · S6 PAO
            </p>
          </div>
          <h1 className="text-4xl font-black text-[#e8edf5]">Publish Post</h1>
          <p className="text-[#8892a4] text-sm mt-2">
            Create a new news post, SITREP, AAR, or announcement for the unit feed.
          </p>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <PostForm />
      </div>

    </div>
  );
}
